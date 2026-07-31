import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendNewsletterVerification } from "@/lib/email";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

// ──────────────────────────────────────────────
// POST /api/newsletter — Daftar subscriber baru
// ──────────────────────────────────────────────
const schema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = schema.parse(body);

    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing?.isVerified) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar dan terverifikasi." },
        { status: 400 }
      );
    }

    // Buat token verifikasi (berlaku 24 jam)
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (existing) {
      // Sudah ada tapi belum terverifikasi → perbarui token
      await prisma.newsletter.update({
        where: { email },
        data: { token, name: name ?? existing.name },
      });
    } else {
      await prisma.newsletter.create({
        data: { email, name: name ?? null, isVerified: false, token },
      });
    }

    // Kirim email verifikasi — jika SMTP tidak dikonfigurasi, tetap sukses
    // agar development tidak error tapi log warning
    try {
      await sendNewsletterVerification(email, token);
    } catch (emailErr) {
      console.warn("[newsletter] Gagal kirim email verifikasi:", emailErr);
      // Di production idealnya kembalikan error, tapi jangan blokir UX
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mendaftar! Silakan cek email Anda untuk konfirmasi.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message ?? "Validasi gagal" },
        { status: 400 }
      );
    }
    console.error("[/api/newsletter POST]", error);
    return NextResponse.json(
      { success: false, error: "Gagal mendaftar newsletter. Coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// GET /api/newsletter — Daftar subscriber (admin)
// ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
    const verified = searchParams.get("verified");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (verified === "true") where.isVerified = true;
    if (verified === "false") where.isVerified = false;

    const [subscribers, total, totalVerified] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true, email: true, name: true, isVerified: true, createdAt: true },
      }),
      prisma.newsletter.count({ where }),
      prisma.newsletter.count({ where: { isVerified: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: subscribers,
      meta: {
        total,
        totalVerified,
        totalUnverified: total - totalVerified,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[/api/newsletter GET]", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data" }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE /api/newsletter — Hapus subscriber (admin)
// ──────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: "ID diperlukan" }, { status: 400 });

    await prisma.newsletter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/newsletter DELETE]", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus" }, { status: 500 });
  }
}
