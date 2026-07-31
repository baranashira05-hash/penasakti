/**
 * Sitemap Index
 * Route asli: GET /api/seo/sitemap-index
 * Diakses publik sebagai: GET /sitemap-index.xml  (via rewrite di next.config.ts)
 *
 * Mendaftarkan semua sitemap ke Google.
 * Submit URL /sitemap-index.xml ke Google Search Console.
 */

import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site-url";

// Selalu hard-coded canonical — tidak boleh pakai env var di sini
const CANONICAL_URL = SITE_URL;

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${CANONICAL_URL}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${CANONICAL_URL}/news-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
