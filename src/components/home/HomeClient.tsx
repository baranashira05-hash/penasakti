"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import LiveBanner from "@/components/home/LiveBanner";
import BreakingSection from "@/components/home/BreakingSection";
import TrendingSection from "@/components/home/TrendingSection";
import LatestNews from "@/components/home/LatestNews";
import PopularArticles from "@/components/home/PopularArticles";
import NewsletterSection from "@/components/home/NewsletterSection";
import AdBanner from "@/components/shared/AdBanner";

function FeaturedArticles({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {articles.map((article: any) => (
        <Link key={article.id} href={`/artikel/${article.slug}`} className="group">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-2">
            {article.featuredImage ? (
              <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <span className="text-3xl">📰</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <span className="text-[9px] font-bold uppercase text-white/80">{article.category?.name || "Berita"}</span>
            </div>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {article.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}

export default function HomeClient() {
  const [heroArticles, setHeroArticles] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?limit=30");
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

      {/* Ad - Header Leaderboard - replaced with featured articles if no ad */}
      <div className="container mx-auto px-4 my-4">
        <FeaturedArticles articles={latestArticles.slice(4, 8)} />
      </div>

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

      {/* Ad - In Article - replaced with more articles */}
      <div className="container mx-auto px-4 my-4">
        <FeaturedArticles articles={latestArticles.slice(8, 12)} />
      </div>

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

      {/* More Articles */}
      <div className="container mx-auto px-4 my-4">
        <FeaturedArticles articles={latestArticles.slice(12, 16)} />
      </div>
    </>
  );
}
