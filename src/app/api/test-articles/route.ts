import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      take: 5,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
      },
    });

    const total = await prisma.article.count({ where: { status: "PUBLISHED" } });

    return NextResponse.json({ success: true, total, articles });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
