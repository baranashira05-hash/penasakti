import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { streamId } = await req.json();
    if (!streamId) {
      return NextResponse.json({ success: false, error: "Stream ID required" }, { status: 400 });
    }

    const stream = await prisma.liveStream.update({
      where: { id: streamId },
      data: { status: "ENDED", endedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: stream });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengakhiri live" }, { status: 500 });
  }
}
