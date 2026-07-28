import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { liveId, username, message } = await req.json();

    if (!liveId || !username || !message) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ success: false, error: "Pesan terlalu panjang" }, { status: 400 });
    }

    const comment = await prisma.liveComment.create({
      data: { liveId, username, message },
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengirim komentar" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const liveId = searchParams.get("liveId");

    if (!liveId) {
      return NextResponse.json({ success: false, error: "liveId required" }, { status: 400 });
    }

    const comments = await prisma.liveComment.findMany({
      where: { liveId, isMuted: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}
