import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "PenaSakti - Portal Berita Nasional Terpercaya",
  description: "Baca berita terkini Indonesia: politik, ekonomi, teknologi, olahraga, dan gaya hidup. Cepat, akurat, dan terpercaya.",
};

export const revalidate = 300; // revalidate setiap 5 menit

async function getHomeArticles() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 3 },
      },
    });

    return articles.map((a) => ({
      ...a,
      viewCount: Number(a.viewCount),
      shareCount: Number(a.shareCount),
      likeCount: Number(a.likeCount),
    }));
  } catch {
    return [];
  }
}

async function getTrendingArticles() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: 10,
      include: {
        category: { select: { id: true, name: true, slug: true, color: true } },
      },
    });

    return articles.map((a) => ({
      ...a,
      viewCount: Number(a.viewCount),
      shareCount: Number(a.shareCount),
      likeCount: Number(a.likeCount),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [articles, trendingArticles] = await Promise.all([
    getHomeArticles(),
    getTrendingArticles(),
  ]);

  return (
    <HomeClient
      initialArticles={articles}
      initialTrending={trendingArticles}
    />
  );
}
