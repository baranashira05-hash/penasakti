import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ads = await prisma.advertisement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: ads });
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

    return NextResponse.json({ success: true, data: ad });
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
