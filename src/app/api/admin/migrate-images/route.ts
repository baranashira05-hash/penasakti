import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImage(wpUrl: string, slug: string): Promise<string | null> {
  const publicId = `penasakti/articles/${slug.replace(/[^a-z0-9]/g, "-").substring(0, 60)}`;
  // Coba langsung dari URL WP
  try {
    const result = await cloudinary.uploader.upload(wpUrl, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
      transformation: [{ quality: "auto:good", fetch_format: "auto", width: 800, crop: "limit" }],
    });
    return result.secure_url;
  } catch {}
  // Fallback: Wayback Machine
  try {
    const archiveUrl = `https://web.archive.org/web/2025/${wpUrl}`;
    const result = await cloudinary.uploader.upload(archiveUrl, {
      public_id: `${publicId}-arch`,
      overwrite: false,
      resource_type: "image",
      transformation: [{ quality: "auto:good", fetch_format: "auto", width: 800, crop: "limit" }],
    });
    return result.secure_url;
  } catch {}
  return null;
}

export async function POST(req: NextRequest) {
  try {
    // Auth via session — tidak perlu secret manual
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized - Silakan login sebagai Admin" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const batch = Number(body.batch) || 10;
    const offset = Number(body.offset) || 0;

    const articles = await prisma.article.findMany({
      where: { featuredImage: { contains: "wp-content/uploads" } },
      select: { id: true, slug: true, featuredImage: true },
      orderBy: { publishedAt: "desc" },
      take: batch,
      skip: offset,
    });

    const total = await prisma.article.count({
      where: { featuredImage: { contains: "wp-content/uploads" } },
    });

    let success = 0;
    let failed = 0;

    for (const article of articles) {
      if (!article.featuredImage || !article.slug) { failed++; continue; }
      const newUrl = await migrateImage(article.featuredImage, article.slug);
      if (newUrl) {
        await prisma.article.update({ where: { id: article.id }, data: { featuredImage: newUrl } });
        success++;
      } else {
        failed++;
      }
    }

    const remaining = Math.max(0, total - offset - articles.length);

    return NextResponse.json({
      success: true,
      processed: articles.length,
      migrated: success,
      failed,
      total,
      remaining,
      nextOffset: offset + batch,
      done: remaining <= 0,
    });
  } catch (error: any) {
    console.error("[migrate-images]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const totalBroken = await prisma.article.count({
      where: { featuredImage: { contains: "wp-content/uploads" } },
    });
    const migrated = await prisma.article.count({
      where: { featuredImage: { contains: "cloudinary" } },
    });
    const valid = await prisma.article.count({
      where: { featuredImage: { not: null } },
    });
    return NextResponse.json({ totalBroken, migrated, valid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
