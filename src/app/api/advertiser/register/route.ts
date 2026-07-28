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

    const existing = await prisma.advertiserProfile.findUnique({ where: { userId: session.user.id } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Anda sudah terdaftar sebagai advertiser" }, { status: 400 });
    }

    const body = await req.json();
    const { companyName, companyDesc, website, phone, address, contactPerson, npwp } = body;

    if (!companyName || !phone || !contactPerson) {
      return NextResponse.json({ success: false, error: "Nama perusahaan, nomor HP, dan contact person wajib diisi" }, { status: 400 });
    }

    const companySlug = slugify(companyName) + "-" + Date.now().toString(36);

    const advertiser = await prisma.advertiserProfile.create({
      data: {
        userId: session.user.id,
        companyName,
        companySlug,
        companyDesc,
        website,
        phone,
        address,
        contactPerson,
        npwp,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: advertiser });
  } catch (error) {
    console.error("Advertiser register error:", error);
    return NextResponse.json({ success: false, error: "Gagal mendaftar" }, { status: 500 });
  }
}
