import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const status = searchParams.get("status") ?? "PUBLISHED";
    const featured = searchParams.get("featured") === "true";
    const breaking = searchParams.get("breaking") === "true";
    const sort = searchParams.get("sort") ?? "publishedAt";
    const q = searchParams.get("q");

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { status };
    if (featured) where.isFeatured = true;
    if (breaking) where.isBreaking = true;
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
          status: true,
          viewCount: true,
          commentCount: true,
          readTime: true,
          publishedAt: true,
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags: { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 5 },
        },
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: articles,
      meta: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
    });
  } catch (error) {
    console.error("[/api/articles GET]", error);
    return NextResponse.json({
      success: true,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    });
  }
}
