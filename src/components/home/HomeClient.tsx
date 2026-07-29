"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import LiveBanner from "@/components/home/LiveBanner";
import BreakingSection from "@/components/home/BreakingSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestNews from "@/components/home/LatestNews";
import PopularArticles from "@/components/home/PopularArticles";
import NewsletterSection from "@/components/home/NewsletterSection";
import AdBanner from "@/components/shared/AdBanner";

export default function HomeClient() {
  const [heroArticles, setHeroArticles] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?limit=20");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const processed = json.data.map((a: any) => ({
              ...a,
              viewCount: a.viewCount || 0,
              commentCount: a.commentCount || 0,
              readTime: a.readTime || 3,
              category: a.category || { id: "1", name: "Berita", slug: "berita", color: "#2563eb" },
              author: a.author || { id: "1", name: "Redaksi PenaSakti", image: null },
              tags: a.tags || [],
            }));
            setHeroArticles(processed.slice(0, 5));
            setLatestArticles(processed);
            setTrendingArticles(processed.slice(0, 10));
          }
        }
      } catch (e) {
        console.error("Failed to load articles:", e);
      }
    }
    loadArticles();
  }, []);

  return (
    <>
      {/* Hero */}
      <HeroSection articles={heroArticles} />

      {/* Live Banner */}
      <LiveBanner />

      {/* Ad - Header Leaderboard */}
      <AdBanner position="HEADER" className="my-4" />

      {/* Berita Terkini + Trending */}
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

      {/* Ad - In Article */}
      <AdBanner position="IN_ARTICLE" className="my-4" />

      {/* Berita Terbaru + Sidebar */}
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

      {/* Ad - Footer */}
      <AdBanner position="FOOTER" className="my-4" />
    </>
  );
}
