import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "10"));

    if (!q || q.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Query terlalu pendek (minimal 2 karakter)" },
        { status: 400 }
      );
    }

    const query = q.trim();
    const skip = (page - 1) * limit;

    const { prisma } = await import("@/lib/prisma");

    const where = {
      status: "PUBLISHED" as const,
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { excerpt: { contains: query, mode: "insensitive" as const } },
        { content: { contains: query, mode: "insensitive" as const } },
        { metaKeywords: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          readTime: true,
          viewCount: true,
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query,
      },
    });
  } catch (error) {
    console.error("[/api/search GET]", error);
    return NextResponse.json(
      { success: true, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0, query: "" } },
      { status: 200 }
    );
  }
}
