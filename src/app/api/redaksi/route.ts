import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/redaksi — public, kembalikan semua anggota aktif
export async function GET() {
  try {
    const members = await prisma.redaksiMember.findMany({
      where: { isActive: true },
      orderBy: [{ group: "asc" }, { order: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ members });
  } catch (error) {
    console.error("[API/REDAKSI GET]", error);
    return NextResponse.json({ error: "Gagal mengambil data redaksi" }, { status: 500 });
  }
}

// POST /api/redaksi — tambah member baru (SUPER_ADMIN only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, jabatan, group, photo, email, order } = body;

    if (!name || !jabatan || !group) {
      return NextResponse.json({ error: "name, jabatan, dan group wajib diisi" }, { status: 400 });
    }

    const member = await prisma.redaksiMember.create({
      data: {
        name,
        jabatan,
        group,
        photo: photo || null,
        email: email || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("[API/REDAKSI POST]", error);
    return NextResponse.json({ error: "Gagal menambah anggota redaksi" }, { status: 500 });
  }
}
