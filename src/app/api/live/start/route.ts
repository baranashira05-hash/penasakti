import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify, nanoid } from "@/lib/utils";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized - Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, locationName, latitude, longitude, city, province, category, thumbnail, quality, isBreaking, isExclusive, isEmergency } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Judul wajib diisi" }, { status: 400 });
    }

    const slug = slugify(title) + "-" + Date.now().toString(36);
    const streamKey = nanoid(24);

    const stream = await prisma.liveStream.create({
      data: {
        title,
        slug,
        description,
        locationName,
        latitude,
        longitude,
        city,
        province,
        category,
        thumbnail,
        quality: quality || "720p",
        isBreaking: isBreaking || false,
        isExclusive: isExclusive || false,
        isEmergency: isEmergency || false,
        streamKey,
        reporterName: session.user.name || "Admin",
        reporterId: session.user.id,
        status: "LIVE",
        startedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: stream });
  } catch (error) {
    console.error("Start live error:", error);
    return NextResponse.json({ success: false, error: "Gagal memulai live" }, { status: 500 });
  }
}
