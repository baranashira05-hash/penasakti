import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
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

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [heroRes, latestRes, trendingRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/articles?status=PUBLISHED&featured=true&limit=5`, {
        next: { revalidate: 60 },
      }),
      fetch(`${baseUrl}/api/articles?status=PUBLISHED&limit=12`, {
        next: { revalidate: 60 },
      }),
      fetch(`${baseUrl}/api/articles?status=PUBLISHED&sort=views&limit=10`, {
        next: { revalidate: 300 },
      }),
    ]);

    return {
      heroArticles: heroRes.status === "fulfilled" && heroRes.value.ok
        ? (await heroRes.value.json()).data || []
        : [],
      latestArticles: latestRes.status === "fulfilled" && latestRes.value.ok
        ? (await latestRes.value.json()).data || []
        : [],
      trendingArticles: trendingRes.status === "fulfilled" && trendingRes.value.ok
        ? (await trendingRes.value.json()).data || []
        : [],
    };
  } catch {
    return { heroArticles: [], latestArticles: [], trendingArticles: [] };
  }
}

export default async function HomePage() {
  const { heroArticles, latestArticles, trendingArticles } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <HeroSection articles={heroArticles} />

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
