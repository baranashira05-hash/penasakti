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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

export const dynamic = "force-dynamic";

export async function GET() {
  let articles: {
    title: string;
    slug: string;
    publishedAt: Date | null;
    keywords: string;
  }[] = [];

  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const dbArticles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: twoDaysAgo },
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

    articles = dbArticles.map((a) => ({
      title: a.title,
      slug: a.slug,
      publishedAt: a.publishedAt,
      keywords:
        a.metaKeywords || a.tags.map((t) => t.tag.name).join(", "),
    }));
  } catch (err) {
    console.error("[news-sitemap] DB error:", err);
  }

  const items = articles
    .map((a) => {
      const pubDate = a.publishedAt
        ? a.publishedAt.toISOString()
        : new Date().toISOString();
      const title = escapeXml(a.title);
      const keywords = a.keywords ? escapeXml(a.keywords) : "";

      return `  <url>
    <loc>${BASE_URL}/artikel/${a.slug}</loc>
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
    },
  });
}

function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
