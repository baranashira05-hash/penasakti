import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        seller: { select: { id: true, storeName: true, storeSlug: true, storeLogo: true, rating: true, ratingCount: true, city: true } },
        category: { select: { name: true, slug: true } },
        reviews: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.product.update({ where: { slug }, data: { viewCount: { increment: 1 } } });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}
