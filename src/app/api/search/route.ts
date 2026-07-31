import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q     = searchParams.get("q");
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(24, parseInt(searchParams.get("limit") ?? "12"));

    if (!q || q.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Query minimal 2 karakter", data: [], meta: { total: 0 } },
        { status: 400 }
      );
    }

    const query = q.trim();
    const skip  = (page - 1) * limit;

    const where = {
      status: "PUBLISHED" as const,
      OR: [
        { title:       { contains: query, mode: "insensitive" as const } },
        { excerpt:     { contains: query, mode: "insensitive" as const } },
        { content:     { contains: query, mode: "insensitive" as const } },
        { metaKeywords:{ contains: query, mode: "insensitive" as const } },
        // Cari juga berdasarkan nama kategori dan tag
        { category:    { name: { contains: query, mode: "insensitive" as const } } },
        { tags:        { some: { tag: { name: { contains: query, mode: "insensitive" as const } } } } },
        { author:      { name: { contains: query, mode: "insensitive" as const } } },
      ],
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          // Artikel yang judulnya mengandung kata kunci diutamakan
          { isFeatured: "desc" },
          { publishedAt: "desc" },
        ],
        select: {
          id:           true,
          title:        true,
          slug:         true,
          excerpt:      true,
          featuredImage:true,
          publishedAt:  true,
          readTime:     true,
          viewCount:    true,
          isBreaking:   true,
          isFeatured:   true,
          author:   { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags:     { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 3 },
          _count:   { select: { comments: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    // Serialize BigInt → Number
    const data = articles.map((a) => ({
      ...a,
      viewCount:  Number(a.viewCount  ?? 0),
      shareCount: 0,
      likeCount:  0,
      commentCount: a._count?.comments ?? 0,
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
        query,
      },
    });
  } catch (error) {
    console.error("[/api/search]", error);
    return NextResponse.json(
      { success: false, data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0, query: "" } },
      { status: 500 }
    );
  }
}
