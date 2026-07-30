import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Download gambar dari URL dan upload ke Vercel Blob
async function migrateToBlob(wpUrl: string, filename: string): Promise<string | null> {
  const urls = [
    wpUrl, // Coba langsung
    `https://web.archive.org/web/2025/${wpUrl}`, // Wayback Machine 2025
    `https://web.archive.org/web/2024/${wpUrl}`, // Wayback Machine 2024
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) continue;

      const contentType = res.headers.get("content-type") || "image/jpeg";
      if (!contentType.startsWith("image/")) continue;

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 1000) continue; // Skip file terlalu kecil (mungkin error page)

      const blobPath = `wp-migration/${filename}`;
      const blob = await put(blobPath, buffer, {
        access: "public",
        contentType,
        addRandomSuffix: false,
      });

      return blob.url;
    } catch {}
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
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

      // Ambil nama file dari URL
      const urlParts = article.featuredImage.split("/");
      const filename = urlParts[urlParts.length - 1] || `${article.slug}.jpg`;

      const newUrl = await migrateToBlob(article.featuredImage, filename);

      if (newUrl) {
        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: newUrl },
        });
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
      where: {
        OR: [
          { featuredImage: { contains: "vercel-blob" } },
          { featuredImage: { contains: "public.blob.vercel" } },
          { featuredImage: { contains: "cloudinary" } },
        ]
      },
    });
    const valid = await prisma.article.count({
      where: { featuredImage: { not: null } },
    });
    return NextResponse.json({ totalBroken, migrated, valid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
