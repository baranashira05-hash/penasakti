import { Metadata } from "next";
import prisma from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import LiveBanner from "@/components/home/LiveBanner";
import BreakingSection from "@/components/home/BreakingSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestNews from "@/components/home/LatestNews";
import CategorySection from "@/components/home/CategorySection";
import FeaturedVideo from "@/components/home/FeaturedVideo";
import PopularArticles from "@/components/home/PopularArticles";
import NewsletterSection from "@/components/home/NewsletterSection";
import AdBanner from "@/components/shared/AdBanner";

export const metadata: Metadata = {
  title: "PenaSakti - Portal Berita Nasional Terpercaya",
  description:
    "Baca berita terkini Indonesia: politik, ekonomi, teknologi, olahraga, dan gaya hidup. Cepat, akurat, dan terpercaya.",
};

// ISR - revalidate every 60 seconds
export const revalidate = 60;
export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [heroArticles, latestArticles, trendingArticles] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 5,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags: { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 3 },
        },
      }),
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 12,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags: { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 3 },
        },
      }),
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { viewCount: "desc" },
        take: 10,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
      }),
    ]);

    // Serialize BigInt
    const serialize = (articles: any[]) => articles.map(a => ({
      ...a,
      viewCount: Number(a.viewCount || 0),
      shareCount: Number(a.shareCount || 0),
      likeCount: Number(a.likeCount || 0),
    }));

    return {
      heroArticles: serialize(heroArticles),
      latestArticles: serialize(latestArticles),
      trendingArticles: serialize(trendingArticles),
    };
  } catch (error) {
    console.error("getHomeData error:", error);
    return { heroArticles: [], latestArticles: [], trendingArticles: [] };
  }
}
  }
}

export default async function HomePage() {
  const { heroArticles, latestArticles, trendingArticles } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <HeroSection articles={heroArticles} />

      {/* 🔴 Live Banner - Tampil saat ada siaran langsung */}
      <div className="bg-gray-900 dark:bg-black">
        <LiveBanner />
      </div>

      {/* Ad Banner - Header */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner position="HEADER" />
      </div>

      {/* Breaking & Trending */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BreakingSection />
          </div>
          <div>
            <TrendingSection articles={trendingArticles} />
          </div>
        </div>
      </div>

      {/* Latest News + Sidebar */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LatestNews articles={latestArticles} />
          </div>
          <aside className="space-y-6">
            <PopularArticles />
            <AdBanner position="SIDEBAR" />
            <NewsletterSection />
          </aside>
        </div>
      </div>

      {/* Category Sections */}
      <CategorySection />

      {/* Featured Video */}
      <FeaturedVideo />

      {/* Ad Banner - Bottom */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner position="FOOTER" />
      </div>
    </>
  );
}
