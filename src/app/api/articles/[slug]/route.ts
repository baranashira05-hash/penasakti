import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });

    if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Increment view
    await prisma.article.update({ where: { slug }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: { ...article, viewCount: Number(article.viewCount) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // slug could be an ID
    const article = await prisma.article.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    await prisma.article.delete({ where: { id: article.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const article = await prisma.article.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });
    if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const updated = await prisma.article.update({
      where: { id: article.id },
      data: {
        title: body.title ?? article.title,
        content: body.content ?? article.content,
        excerpt: body.excerpt ?? article.excerpt,
        status: body.status ?? article.status,
        metaTitle: body.metaTitle ?? article.metaTitle,
        metaDesc: body.metaDesc ?? article.metaDesc,
        featuredImage: body.featuredImage ?? article.featuredImage,
      },
    });

    return NextResponse.json({ success: true, data: { ...updated, viewCount: Number(updated.viewCount) } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
