import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const stream = await prisma.liveStream.findUnique({
      where: { slug },
      include: {
        comments: { where: { isMuted: false }, orderBy: { createdAt: "desc" }, take: 50 },
        reactions: { orderBy: { createdAt: "desc" }, take: 100 },
      },
    });

    if (!stream) {
      return NextResponse.json({ success: false, error: "Stream not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: stream });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stream" }, { status: 500 });
  }
}
