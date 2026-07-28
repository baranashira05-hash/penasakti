import { NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

const SAMPLE_ARTICLES = [
  {
    title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun untuk Pemulihan Nasional",
    slug: "presiden-umumkan-paket-stimulus-ekonomi",
    excerpt: "Pemerintah menggelontorkan stimulus besar-besaran untuk mendorong pertumbuhan ekonomi nasional yang ditargetkan mencapai 6% pada tahun ini.",
    category: "Nasional",
    author: "Ahmad Fauzi",
    date: new Date(Date.now() - 3600000).toUTCString(),
    image: "https://picsum.photos/seed/rss1/1200/630",
  },
  {
    title: "Timnas Indonesia Lolos ke Final Piala AFF 2026, Siap Rebut Gelar Perdana",
    slug: "timnas-indonesia-lolos-final-piala-aff",
    excerpt: "Garuda Nusantara memastikan tiket final setelah mengalahkan Vietnam 3-1 dalam pertandingan dramatis di Stadion Gelora Bung Karno.",
    category: "Olahraga",
    author: "Budi Santoso",
    date: new Date(Date.now() - 7200000).toUTCString(),
    image: "https://picsum.photos/seed/rss2/1200/630",
  },
  {
    title: "Startup Indonesia Raih Valuasi Unicorn Ketiga Tahun Ini, Sektor Fintech Mendominasi",
    slug: "startup-indonesia-raih-valuasi-unicorn",
    excerpt: "Ekosistem startup Indonesia terus berkembang pesat dengan tiga unicorn baru yang lahir dalam satu tahun, menarik investasi global.",
    category: "Teknologi",
    author: "Siti Rahayu",
    date: new Date(Date.now() - 10800000).toUTCString(),
    image: "https://picsum.photos/seed/rss3/1200/630",
  },
];

export async function GET() {
  let articles = SAMPLE_ARTICLES;

  try {
    const { prisma } = await import("@/lib/prisma");
    const dbArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 50,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    });

    if (dbArticles.length > 0) {
      articles = dbArticles.map((a) => ({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        category: a.category?.name || "Berita",
        author: a.author?.name || "Redaksi",
        date: a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString(),
        image: a.featuredImage || "",
      }));
    }
  } catch {
    // Use sample articles if DB unavailable
  }

  const rssItems = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${APP_URL}/artikel/${a.slug}</link>
      <guid isPermaLink="true">${APP_URL}/artikel/${a.slug}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <category><![CDATA[${a.category}]]></category>
      <dc:creator><![CDATA[${a.author}]]></dc:creator>
      <pubDate>${a.date}</pubDate>
      ${a.image ? `<media:content url="${a.image}" width="1200" height="630" medium="image" xmlns:media="http://search.yahoo.com/mrss/"/>` : ""}
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>PenaSakti - Portal Berita Nasional Terpercaya</title>
    <link>${APP_URL}</link>
    <description>PenaSakti adalah portal berita nasional terpercaya yang menyajikan informasi terkini, akurat, dan berimbang seputar politik, ekonomi, teknologi, olahraga, dan gaya hidup.</description>
    <language>id-ID</language>
    <generator>PenaSakti Next.js RSS Feed</generator>
    <copyright>© ${new Date().getFullYear()} PenaSakti. All Rights Reserved.</copyright>
    <category>News</category>
    <category>Indonesia</category>
    <managingEditor>redaksi@penasakti.com (Redaksi PenaSakti)</managingEditor>
    <webMaster>tech@penasakti.com (Tim Teknis PenaSakti)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${APP_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${APP_URL}/og-image.jpg</url>
      <title>PenaSakti</title>
      <link>${APP_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
