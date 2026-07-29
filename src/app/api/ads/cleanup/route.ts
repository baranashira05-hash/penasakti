import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Delete all ads with base64 code that's too large (> 50KB)
export async function POST() {
  try {
    const allAds = await prisma.advertisement.findMany();
    let deleted = 0;

    for (const ad of allAds) {
      if (ad.code && ad.code.length > 50000) {
        await prisma.advertisement.delete({ where: { id: ad.id } });
        deleted++;
      }
    }

    return NextResponse.json({ success: true, deleted, remaining: allAds.length - deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Cleanup failed" }, { status: 500 });
  }
}
