import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT /api/redaksi/[id] — update member (SUPER_ADMIN only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, jabatan, group, photo, email, order, isActive } = body;

    const existing = await prisma.redaksiMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }

    const member = await prisma.redaksiMember.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(jabatan !== undefined && { jabatan }),
        ...(group !== undefined && { group }),
        ...(photo !== undefined && { photo }),
        ...(email !== undefined && { email }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("[API/REDAKSI PUT]", error);
    return NextResponse.json({ error: "Gagal mengupdate anggota redaksi" }, { status: 500 });
  }
}

// DELETE /api/redaksi/[id] — hapus member (SUPER_ADMIN only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.redaksiMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }

    await prisma.redaksiMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/REDAKSI DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus anggota redaksi" }, { status: 500 });
  }
}
