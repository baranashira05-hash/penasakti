import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { notifyGoogleIndexing, pingSitemaps } from "@/lib/google-indexing";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));
    const category = searchParams.get("category");
    const status = searchParams.get("status") ?? "PUBLISHED";
    const featured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") ?? "publishedAt";
    const q = searchParams.get("q");

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { status };
    if (featured) where.isFeatured = true;
    if (category) where.category = { slug: category };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "views"
        ? { viewCount: "desc" as const }
        : { publishedAt: "desc" as const };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags: { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 5 },
        },
      }),
      prisma.article.count({ where }),
    ]);

    // Convert BigInt to Number for JSON serialization
    const serializedArticles = articles.map((a) => ({
      ...a,
      viewCount: Number(a.viewCount),
      shareCount: Number(a.shareCount),
      likeCount: Number(a.likeCount),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: serializedArticles,
      meta: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
    });
  } catch (error) {
    console.error("[/api/articles GET]", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Query failed",
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, categoryId, tags, featuredImage, metaTitle, metaDesc, metaKeywords, status } = body;

    if (!title?.trim()) {
      return NextResponse.json({ success: false, error: "Judul harus diisi" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Kategori harus dipilih" }, { status: 400 });
    }

    // Generate slug dari judul
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Pastikan slug unik
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Hitung read time
    const wordCount = content?.replace(/<[^>]+>/g, "").split(/\s+/).length || 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug,
        content: content || "",
        excerpt: excerpt || "",
        featuredImage: featuredImage || null,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || "",
        metaKeywords: metaKeywords || "",
        status: status || "DRAFT",
        readTime,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
        categoryId,
      },
    });

    // Tambahkan tags jika ada
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        await prisma.articleTag.upsert({
          where: { articleId_tagId: { articleId: article.id, tagId: tag.id } },
          update: {},
          create: { articleId: article.id, tagId: tag.id },
        });
      }
    }

    // Jika artikel langsung PUBLISHED → kirim notifikasi ke Google (fire & forget)
    if (status === "PUBLISHED") {
      Promise.all([
        notifyGoogleIndexing(slug, "URL_UPDATED"),
        pingSitemaps(),
      ]).catch((e) => console.error("[GoogleIndexing] background error:", e));
    }

    return NextResponse.json({ success: true, data: { ...article, viewCount: Number(article.viewCount) } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Gagal menyimpan artikel",
    }, { status: 500 });
  }
}
