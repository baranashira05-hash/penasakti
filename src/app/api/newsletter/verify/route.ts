import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendNewsletterWelcome } from "@/lib/email";

/**
 * GET /api/newsletter/verify?token=xxx
 *
 * Klik dari link email verifikasi.
 * Menandai subscriber sebagai terverifikasi dan redirect ke halaman sukses.
 */
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/?newsletter=invalid`);
  }

  try {
    const subscriber = await prisma.newsletter.findFirst({
      where: { token },
    });

    if (!subscriber) {
      return NextResponse.redirect(`${baseUrl}/?newsletter=invalid`);
    }

    if (subscriber.isVerified) {
      // Sudah diverifikasi sebelumnya
      return NextResponse.redirect(`${baseUrl}/?newsletter=already-verified`);
    }

    // Tandai sebagai terverifikasi dan hapus token
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: { isVerified: true, token: null },
    });

    // Kirim email selamat datang
    try {
      await sendNewsletterWelcome(subscriber.email);
    } catch (err) {
      console.warn("[newsletter/verify] Gagal kirim welcome email:", err);
    }

    return NextResponse.redirect(`${baseUrl}/?newsletter=verified`);
  } catch (error) {
    console.error("[newsletter/verify]", error);
    return NextResponse.redirect(`${baseUrl}/?newsletter=error`);
  }
}
