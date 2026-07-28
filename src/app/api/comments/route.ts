import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));

    if (!articleId) {
      return NextResponse.json({ success: false, error: "articleId diperlukan" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { articleId, status: "APPROVED", parentId: null },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, image: true } },
          replies: {
            where: { status: "APPROVED" },
            orderBy: { createdAt: "asc" },
            include: { user: { select: { id: true, name: true, image: true } } },
          },
        },
      }),
      prisma.comment.count({ where: { articleId, status: "APPROVED" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: comments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[/api/comments GET]", error);
    return NextResponse.json({ success: true, data: [], meta: { total: 0 } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, content, parentId, guestName, guestEmail } = body;

    if (!articleId || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Konten komentar diperlukan" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ success: false, error: "Komentar terlalu panjang" }, { status: 400 });
    }

    const { getServerSession } = await import("next-auth");
    const { default: authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    // Guest comment requires name
    if (!session?.user && !guestName?.trim()) {
      return NextResponse.json({ success: false, error: "Nama diperlukan" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const comment = await prisma.comment.create({
      data: {
        articleId,
        content: content.trim(),
        parentId: parentId ?? null,
        userId: session?.user?.id ?? null,
        guestName: !session ? (guestName ?? null) : null,
        guestEmail: !session ? (guestEmail ?? null) : null,
        status: "PENDING", // All new comments need moderation
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
      message: "Komentar dikirim dan menunggu moderasi",
    }, { status: 201 });
  } catch (error) {
    console.error("[/api/comments POST]", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim komentar" }, { status: 500 });
  }
}
