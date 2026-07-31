import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: "PenaSakti - Portal Berita Nasional Terpercaya",
  description:
    "Baca berita terkini Indonesia: politik, ekonomi, teknologi, olahraga, dan gaya hidup. Cepat, akurat, dan terpercaya.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "PenaSakti - Portal Berita Nasional Terpercaya",
    description:
      "Baca berita terkini Indonesia: politik, ekonomi, teknologi, olahraga, dan gaya hidup. Cepat, akurat, dan terpercaya.",
    url: BASE_URL,
    siteName: "PenaSakti",
    locale: "id_ID",
    type: "website",
  },
};

// Revalidate setiap 5 menit — ISR agar halaman di-serve dari cache Vercel
export const revalidate = 300;

async function getHomeData() {
  // Satu kali koneksi, 3 query paralel — lebih efisien daripada 3 koneksi terpisah
  const [articles, trendingArticles, popularArticles] = await Promise.all([
    // Artikel terbaru untuk main feed
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        readTime: true,
        isBreaking: true,
        isFeatured: true,
        author:   { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags:     { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 3 },
      },
    }),

    // Artikel trending (view terbanyak 7 hari terakhir)
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { viewCount: "desc" },
      take: 15,
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        category: { select: { id: true, name: true, slug: true, color: true } },
      },
    }),

    // Artikel paling populer sepanjang waktu untuk sidebar
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
      },
    }),
  ]);

  // Serialize BigInt ke Number agar bisa di-JSON-stringify
  const serialize = (a: any) => ({
    ...a,
    viewCount: Number(a.viewCount ?? 0),
    shareCount: Number(a.shareCount ?? 0),
    likeCount:  Number(a.likeCount ?? 0),
  });

  return {
    articles:        articles.map(serialize),
    trendingArticles: trendingArticles.map(serialize),
    popularArticles:  popularArticles.map(serialize),
  };
}

export default async function HomePage() {
  let data = { articles: [], trendingArticles: [], popularArticles: [] };

  try {
    data = await getHomeData();
  } catch (err) {
    console.error("[HomePage] DB error:", err);
    // Tampilkan halaman kosong daripada crash
  }

  return (
    <HomeClient
      initialArticles={data.articles}
      initialTrending={data.trendingArticles}
      popularArticles={data.popularArticles}
    />
  );
}
