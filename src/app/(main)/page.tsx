import { Metadata } from "next";
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    
    const res = await fetch(`${baseUrl}/api/test-articles`, { cache: "no-store" });
    
    if (res.ok) {
      const json = await res.json();
      if (json.articles && json.articles.length > 0) {
        // test-articles only returns basic fields, fetch full from articles API
        const fullRes = await fetch(`${baseUrl}/api/articles?limit=12`, { cache: "no-store" });
        if (fullRes.ok) {
          const fullJson = await fullRes.json();
          if (fullJson.data && fullJson.data.length > 0) {
            return {
              heroArticles: fullJson.data.slice(0, 5),
              latestArticles: fullJson.data,
              trendingArticles: fullJson.data.slice(0, 10),
            };
          }
        }
        // Fallback: use test-articles data directly
        const articles = json.articles.map((a: any) => ({
          ...a,
          viewCount: 0,
          shareCount: 0,
          likeCount: 0,
          commentCount: 0,
          readTime: 3,
          excerpt: "",
          featuredImage: null,
          isBreaking: false,
          isFeatured: false,
          category: { id: "1", name: "Berita", slug: "berita", color: "#e74c3c" },
          author: { id: "1", name: "Redaksi", image: null },
          tags: [],
        }));
        return {
          heroArticles: articles.slice(0, 5),
          latestArticles: articles,
          trendingArticles: articles,
        };
      }
    }
    return { heroArticles: [], latestArticles: [], trendingArticles: [] };
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
