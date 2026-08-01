/**
 * POST /api/seo/index-now
 * Trigger manual indexing untuk satu artikel atau semua artikel published hari ini.
 * Hanya bisa diakses oleh SUPER_ADMIN atau ADMIN.
 *
 * Body: { slug?: string }   → jika slug diisi, index satu artikel
 *                            → jika kosong, index semua artikel hari ini (maks 200/hari limit Google)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notifyGoogleIndexing, pingSitemaps } from "@/lib/google-indexing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { slug } = body as { slug?: string };

    // Ping sitemap dulu
    await pingSitemaps();

    // Satu artikel
    if (slug) {
      const result = await notifyGoogleIndexing(slug, "URL_UPDATED");
      return NextResponse.json({ success: result.success, message: result.message, count: 1 });
    }

    // Semua artikel published hari ini (24 jam terakhir)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: oneDayAgo },
      },
      select: { slug: true },
      orderBy: { publishedAt: "desc" },
      take: 200, // Google Indexing API limit: 200 req/hari
    });

    const results = await Promise.allSettled(
      articles.map((a) => notifyGoogleIndexing(a.slug, "URL_UPDATED"))
    );

    const success = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
    const failed = results.length - success;

    return NextResponse.json({
      success: true,
      message: `${success} artikel berhasil dikirim ke Google${failed > 0 ? `, ${failed} gagal` : ""}`,
      count: articles.length,
    });
  } catch (error) {
    console.error("[API/SEO/INDEX-NOW]", error);
    return NextResponse.json({ error: "Gagal mengirim ke Google" }, { status: 500 });
  }
}
