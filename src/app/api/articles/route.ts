import { NextRequest, NextResponse } from "next/server";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";
import { createHash } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const status = searchParams.get("status") ?? "PUBLISHED";
  const featured = searchParams.get("featured") === "true";
  const breaking = searchParams.get("breaking") === "true";
  const editorChoice = searchParams.get("editorChoice") === "true";
  const sort = searchParams.get("sort") ?? "publishedAt";
  const q = searchParams.get("q");

  const cacheable = status === "PUBLISHED" && !q && page <= 3;
  let cacheKey: string | null = null;

  if (cacheable) {
    const params = JSON.stringify({ page, limit, category, tag, featured, breaking, editorChoice, sort });
    const hash = createHash("sha256").update(params).digest("hex").slice(0, 12);
    cacheKey = `articles:${hash}`;
    try {
      const cached = await cache.get<{ data: unknown; meta: unknown }>(cacheKey);
      if (cached) {
        return NextResponse.json(
          { success: true, data: cached.data, meta: cached.meta },
          { headers: { "X-Cache": "HIT", "X-Cache-Key": cacheKey } }
        );
      }
    } catch {
      cacheKey = null;
    }
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { status };
    if (featured) where.isFeatured = true;
    if (breaking) where.isBreaking = true;
    if (editorChoice) where.isEditorChoice = true;
    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "views"
        ? { viewCount: "desc" as const }
        : sort === "comments"
        ? { commentCount: "desc" as const }
        : { publishedAt: "desc" as const };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          isBreaking: true,
          isFeatured: true,
          isEditorChoice: true,
          status: true,
          viewCount: true,
          commentCount: true,
          readTime: true,
          publishedAt: true,
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags: {
            select: { tag: { select: { id: true, name: true, slug: true } } },
            take: 5,
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const response = {
      success: true,
      data: articles,
      meta: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
    };

    if (cacheable && cacheKey) {
      const ttl = breaking || featured ? CACHE_TTL.SHORT : CACHE_TTL.MEDIUM;
      cache.set(cacheKey, { data: articles, meta: response.meta }, ttl).catch(() => {});
    }

    return NextResponse.json(response, {
      headers: {
        "X-Cache": cacheable ? "MISS" : "BYPASS",
        ...(cacheKey ? { "X-Cache-Key": cacheKey } : {}),
        "Cache-Control": `s-maxage=${cacheable ? CACHE_TTL.SHORT : 0}, stale-while-revalidate=${CACHE_TTL.MEDIUM}`,
      },
    });
  } catch (error) {
    console.error("[/api/articles GET]", error);
    return NextResponse.json(
      { success: true, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false } },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import("next-auth");
    const { default: authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const WRITE_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "JOURNALIST", "CONTRIBUTOR"];
    if (!WRITE_ROLES.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const { z } = await import("zod");
    const slugifyModule = await import("slugify");
    const slugifyFn = slugifyModule.default;

    const schema = z.object({
      title: z.string().min(5, "Judul minimal 5 karakter"),
      excerpt: z.string().optional(),
      content: z.string().min(10, "Konten terlalu pendek"),
      categoryId: z.string().min(1, "Kategori wajib dipilih"),
      tags: z.array(z.string()).optional(),
      featuredImage: z.string().url().optional().or(z.literal("")),
      status: z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED", "TRASH"]).optional(),
      metaTitle: z.string().optional(),
      metaDesc: z.string().optional(),
      metaKeywords: z.string().optional(),
      isBreaking: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      isEditorChoice: z.boolean().optional(),
      allowComments: z.boolean().optional(),
      source: z.string().optional(),
      sourceUrl: z.string().url().optional().or(z.literal("")),
    });

    const data = schema.parse(body);

    const slug = slugifyFn(data.title, { lower: true, strict: true }) + "-" + Date.now();

    const { estimateReadTime } = await import("@/lib/utils");
    const readTime = estimateReadTime(data.content);

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        authorId: session.user.id,
        featuredImage: data.featuredImage || null,
        status: (data.status as "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED" | "TRASH") ?? "DRAFT",
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        metaKeywords: data.metaKeywords,
        isBreaking: data.isBreaking ?? false,
        isFeatured: data.isFeatured ?? false,
        isEditorChoice: data.isEditorChoice ?? false,
        allowComments: data.allowComments ?? true,
        source: data.source,
        sourceUrl: data.sourceUrl,
        readTime,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        tags: data.tags?.length
          ? {
              create: data.tags.map((tagName: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
                    create: {
                      name: tagName,
                      slug: tagName.toLowerCase().replace(/\s+/g, "-"),
                    },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    console.error("[/api/articles POST]", error);
    const { z } = await import("zod");
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Gagal membuat artikel" }, { status: 500 });
  }
}
