import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/newsletter/unsubscribe?token=xxx
 *
 * Klik dari link unsubscribe di footer email.
 * Menghapus subscriber dari DB dan redirect ke halaman konfirmasi.
 */
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/?newsletter=unsubscribe-invalid`);
  }

  try {
    const subscriber = await prisma.newsletter.findFirst({
      where: { token },
    });

    if (!subscriber) {
      // Token tidak ditemukan — mungkin sudah unsubscribe
      return NextResponse.redirect(`${baseUrl}/?newsletter=unsubscribed`);
    }

    await prisma.newsletter.delete({ where: { id: subscriber.id } });
    return NextResponse.redirect(`${baseUrl}/?newsletter=unsubscribed`);
  } catch (error) {
    console.error("[newsletter/unsubscribe]", error);
    return NextResponse.redirect(`${baseUrl}/?newsletter=error`);
  }
}

/**
 * POST /api/newsletter/unsubscribe
 *
 * Alternatif via form (jika user memasukkan email langsung).
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email diperlukan" }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.findUnique({ where: { email } });
    if (!subscriber) {
      return NextResponse.json({ success: false, error: "Email tidak ditemukan" }, { status: 404 });
    }

    await prisma.newsletter.delete({ where: { email } });
    return NextResponse.json({ success: true, message: "Berhasil berhenti berlangganan." });
  } catch (error) {
    console.error("[newsletter/unsubscribe POST]", error);
    return NextResponse.json({ success: false, error: "Gagal berhenti berlangganan" }, { status: 500 });
  }
}
