import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if already a seller
    const existing = await prisma.sellerProfile.findUnique({ where: { userId: session.user.id } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Anda sudah terdaftar sebagai seller" }, { status: 400 });
    }

    const body = await req.json();
    const { storeName, storeDesc, phone, address, city, province, bankName, bankAccount, bankHolder } = body;

    if (!storeName || !phone) {
      return NextResponse.json({ success: false, error: "Nama toko dan nomor HP wajib diisi" }, { status: 400 });
    }

    const storeSlug = slugify(storeName) + "-" + Date.now().toString(36);

    const seller = await prisma.sellerProfile.create({
      data: {
        userId: session.user.id,
        storeName,
        storeSlug,
        storeDesc,
        phone,
        address,
        city,
        province,
        bankName,
        bankAccount,
        bankHolder,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: seller });
  } catch (error) {
    console.error("Seller register error:", error);
    return NextResponse.json({ success: false, error: "Gagal mendaftar seller" }, { status: 500 });
  }
}
