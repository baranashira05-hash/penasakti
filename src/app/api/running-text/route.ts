import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Store running text in SiteSettings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    const runningText = settings?.footerText || "";
    // footerText is repurposed to store running text JSON array
    let texts: string[] = [];
    try {
      texts = JSON.parse(runningText);
    } catch {
      texts = runningText ? [runningText] : [];
    }
    return NextResponse.json({ success: true, data: texts });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { texts } = await req.json();
    if (!Array.isArray(texts)) {
      return NextResponse.json({ success: false, error: "texts harus array" }, { status: 400 });
    }

    // Upsert site settings with running text
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { footerText: JSON.stringify(texts) },
      });
    } else {
      await prisma.siteSettings.create({
        data: { footerText: JSON.stringify(texts) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyimpan" }, { status: 500 });
  }
}
