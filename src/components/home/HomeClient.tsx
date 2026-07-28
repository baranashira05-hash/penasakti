"use client";

import { useState, useEffect } from "react";
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

export default function HomeClient() {
  const [heroArticles, setHeroArticles] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?limit=12");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setHeroArticles(json.data.slice(0, 5));
            setLatestArticles(json.data);
            setTrendingArticles(json.data.slice(0, 10));
          }
        }
      } catch (e) {
        console.error("Failed to load articles:", e);
      } finally {
        setLoaded(true);
      }
    }
    loadArticles();
  }, []);

  return (
    <>
      <HeroSection articles={heroArticles} />

      <div className="bg-gray-900 dark:bg-black">
        <LiveBanner />
      </div>

      <div className="container mx-auto px-4 py-4">
        <AdBanner position="HEADER" />
      </div>

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

      <CategorySection />
      <FeaturedVideo />

      <div className="container mx-auto px-4 py-4">
        <AdBanner position="FOOTER" />
      </div>
    </>
  );
}
