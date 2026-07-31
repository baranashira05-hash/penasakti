import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Iklan jarang berubah — cache 5 menit di CDN, stale 10 menit
// Override header "no-store" yang ada di next.config.ts untuk route ini
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position");
    const forDisplay = searchParams.get("display") === "true";

    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (position) where.position = position;

    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        code: forDisplay ? true : false,
        position: true,
        status: true,
        impressions: true,
        clicks: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    // For display: only return ads with code < 50KB to prevent timeout
    const data = forDisplay
      ? ads.filter((ad: any) => !ad.code || ad.code.length < 50000)
      : ads;

    const res = NextResponse.json({ success: true, data });
    // Cache 5 menit di browser & CDN — iklan tidak butuh real-time
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res;
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, position, status, startDate, endDate } = body;

    if (!name || !position) {
      return NextResponse.json({ success: false, error: "Nama dan posisi wajib" }, { status: 400 });
    }

    // If code is base64 image > 100KB, reject and ask for URL instead
    if (code && code.startsWith("data:") && code.length > 100000) {
      return NextResponse.json({ success: false, error: "Gambar terlalu besar. Gunakan URL gambar dari hosting (Imgur, Cloudinary, dll) atau kompres gambar di bawah 100KB." }, { status: 400 });
    }

    const ad = await prisma.advertisement.create({
      data: {
        name,
        code: code || "",
        position,
        status: status || "ACTIVE",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: { id: ad.id, name: ad.name, position: ad.position } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal membuat iklan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.advertisement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menghapus" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, code, position, status } = body;

    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    if (code && code.startsWith("data:") && code.length > 100000) {
      return NextResponse.json({ success: false, error: "Gambar terlalu besar. Gunakan URL dari hosting." }, { status: 400 });
    }

    const updated = await prisma.advertisement.update({
      where: { id },
      data: { name, code: code || "", position, status: status || "ACTIVE" },
    });

    return NextResponse.json({ success: true, data: { id: updated.id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal update" }, { status: 500 });
  }
}
