import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload gambar dari URL ke Cloudinary
async function migrateImage(wpUrl: string, slug: string): Promise<string | null> {
  try {
    const publicId = `penasakti/articles/${slug.replace(/[^a-z0-9]/g, "-").substring(0, 60)}`;

    const result = await cloudinary.uploader.upload(wpUrl, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
      transformation: [{ quality: "auto:good", fetch_format: "auto", width: 800, crop: "limit" }],
    });
    return result.secure_url;
  } catch (e: any) {
    // Coba ambil dari Wayback Machine
    try {
      const archiveUrl = `https://web.archive.org/web/2025/${wpUrl}`;
      const publicId = `penasakti/articles/${slug.replace(/[^a-z0-9]/g, "-").substring(0, 60)}`;
      const result = await cloudinary.uploader.upload(archiveUrl, {
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
        transformation: [{ quality: "auto:good", fetch_format: "auto", width: 800, crop: "limit" }],
      });
      return result.secure_url;
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verifikasi secret key
    const { secret, batch = 20, offset = 0 } = await req.json();
    if (secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil artikel dengan gambar WordPress
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

    const results = { success: 0, failed: 0, total, remaining: total - offset - batch };

    for (const article of articles) {
      if (!article.featuredImage || !article.slug) continue;

      const newUrl = await migrateImage(article.featuredImage, article.slug);

      if (newUrl) {
        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: newUrl },
        });
        results.success++;
      } else {
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: articles.length,
      ...results,
      nextOffset: offset + batch,
      done: offset + batch >= total,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const total = await prisma.article.count({
      where: { featuredImage: { contains: "wp-content/uploads" } },
    });
    const migrated = await prisma.article.count({
      where: { featuredImage: { contains: "cloudinary" } },
    });
    const valid = await prisma.article.count({
      where: {
        featuredImage: {
          not: { contains: "wp-content/uploads" },
          not: null,
        },
      },
    });

    return NextResponse.json({ totalBroken: total, migrated, valid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
