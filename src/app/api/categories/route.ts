import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
        description: true,
        _count: { select: { articles: true } },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    // Return static fallback when DB unavailable
    const { CATEGORIES } = await import("@/lib/utils");
    return NextResponse.json({
      success: true,
      data: CATEGORIES.map((c, i) => ({ id: c.slug, ...c, order: i, isActive: true, icon: null, description: null, _count: { articles: 0 } })),
    });
  }
}
