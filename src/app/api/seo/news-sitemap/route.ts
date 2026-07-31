/**
 * Google News Sitemap
 * Route asli: GET /api/seo/news-sitemap
 * Diakses publik sebagai: GET /news-sitemap.xml  (via rewrite di next.config.ts)
 *
 * Hanya berisi artikel yang dipublish dalam 48 jam terakhir.
 * Google News mensyaratkan artikel fresh (maks 2 hari).
 * Ref: https://support.google.com/news/publisher-center/answer/9606710
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

// Selalu hard-coded canonical — tidak boleh pakai env var di sini
const CANONICAL_URL = SITE_URL;

// Wajib force-dynamic agar tidak di-static-generate saat build
export const dynamic = "force-dynamic";

export async function GET() {
  let articles: {
    title: string;
    slug: string;
    publishedAt: Date;
    keywords: string;
  }[] = [];

  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const dbArticles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          not: null,
          gte: twoDaysAgo,
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 1000,
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        metaKeywords: true,
        tags: { select: { tag: { select: { name: true } } }, take: 5 },
      },
    });

    articles = dbArticles
      .filter((a): a is typeof a & { publishedAt: Date } => a.publishedAt !== null)
      .map((a) => {
        // Bersihkan keywords — hapus trailing titik/koma, normalize whitespace
        const rawKeywords = a.metaKeywords || a.tags.map((t) => t.tag.name).join(", ");
        const cleanKeywords = rawKeywords
          .replace(/[.]+$/g, "")   // hapus trailing titik
          .replace(/,\s*$/, "")    // hapus trailing koma
          .replace(/\s+/g, " ")    // normalize multiple spaces
          .trim();

        return {
          title: normalizeText(a.title),
          slug: a.slug,
          publishedAt: a.publishedAt,
          keywords: cleanKeywords,
        };
      });
  } catch (err) {
    console.error("[news-sitemap] DB error:", err);
    // Kembalikan sitemap kosong yang valid daripada error 500
  }

  const items = articles
    .map((a) => {
      // Format ISO 8601 — wajib untuk Google News
      const pubDate = a.publishedAt.toISOString();
      const title = escapeXml(a.title);
      const keywords = a.keywords ? escapeXml(a.keywords) : "";

      // Slug sudah bersih (lowercase alphanumeric + tanda hubung)
      // Jangan encodeURIComponent karena akan mengubah - menjadi %2D di beberapa kasus
      const loc = `${CANONICAL_URL}/artikel/${a.slug}`;

      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>PenaSakti</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>${
        keywords
          ? `\n      <news:keywords>${keywords}</news:keywords>`
          : ""
      }
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}

/**
 * Normalisasi teks:
 * - Ganti em dash (–), en dash (—), dan karakter dash Unicode lainnya ke tanda minus ASCII
 * - Ganti smart quotes ke straight quotes
 * - Normalize multiple whitespace
 * - Trim
 */
function normalizeText(str: string): string {
  if (!str) return "";
  return str
    // Em dash (U+2013) dan en dash (U+2014) → tanda minus biasa
    .replace(/[\u2013\u2014]/g, "-")
    // Smart quotes → straight quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Ellipsis Unicode → tiga titik
    .replace(/\u2026/g, "...")
    // Non-breaking space → regular space
    .replace(/\u00A0/g, " ")
    // Normalize multiple whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Escape karakter XML wajib.
 * Hanya 5 karakter yang perlu di-escape di XML:
 * & < > " '
 */
function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
