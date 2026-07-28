import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { prisma } = await import("@/lib/prisma");

    const article = await prisma.article.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: { select: { id: true, name: true, image: true, bio: true } },
        editor: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        _count: { select: { comments: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fire-and-forget view count increment
    prisma.article
      .update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("[/api/articles/[slug] GET]", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { getServerSession } = await import("next-auth");
    const { default: authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();

    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      return NextResponse.json({ success: false, error: "Tidak ditemukan" }, { status: 404 });
    }

    // Authors can edit their own; editors/admins can edit any
    const canEdit =
      article.authorId === session.user.id ||
      ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role);
    if (!canEdit) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Save revision before updating
    await prisma.articleRevision.create({
      data: {
        articleId: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        version: await prisma.articleRevision.count({ where: { articleId: article.id } }).then((c) => c + 1),
        createdBy: session.user.id,
      },
    });

    const updated = await prisma.article.update({
      where: { id: article.id },
      data: {
        title: body.title ?? article.title,
        excerpt: body.excerpt ?? article.excerpt,
        content: body.content ?? article.content,
        featuredImage: body.featuredImage ?? article.featuredImage,
        status: body.status ?? article.status,
        metaTitle: body.metaTitle ?? article.metaTitle,
        metaDesc: body.metaDesc ?? article.metaDesc,
        metaKeywords: body.metaKeywords ?? article.metaKeywords,
        isBreaking: body.isBreaking ?? article.isBreaking,
        isFeatured: body.isFeatured ?? article.isFeatured,
        isEditorChoice: body.isEditorChoice ?? article.isEditorChoice,
        publishedAt:
          body.status === "PUBLISHED" && !article.publishedAt ? new Date() : article.publishedAt,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[/api/articles/[slug] PUT]", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { getServerSession } = await import("next-auth");
    const { default: authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { prisma } = await import("@/lib/prisma");
    await prisma.article.update({ where: { slug }, data: { status: "TRASH" } });

    return NextResponse.json({ success: true, message: "Artikel dipindahkan ke sampah" });
  } catch (error) {
    console.error("[/api/articles/[slug] DELETE]", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus" }, { status: 500 });
  }
}
