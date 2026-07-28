import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = newsletterSchema.parse(body);

    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json(
          { success: false, error: "Email sudah terdaftar" },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Silakan verifikasi email Anda",
      });
    }

    await prisma.newsletter.create({
      data: { email, name, isVerified: false },
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil mendaftar! Silakan cek email untuk verifikasi.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message ?? "Validasi gagal" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Gagal mendaftar newsletter" },
      { status: 500 }
    );
  }
}
