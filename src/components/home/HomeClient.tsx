"use client";

import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import LiveBanner from "@/components/home/LiveBanner";
import BreakingSection from "@/components/home/BreakingSection";
import TrendingSection from "@/components/home/TrendingSection";
import PopularArticles from "@/components/home/PopularArticles";
import NewsletterSection from "@/components/home/NewsletterSection";
import AdBanner from "@/components/shared/AdBanner";
import ArticleImage from "@/components/shared/ArticleImage";

interface HomeClientProps {
  initialArticles?: any[];
  initialTrending?: any[];
  popularArticles?: any[];
}

export default function HomeClient({
  initialArticles = [],
  initialTrending = [],
  popularArticles = [],
}: HomeClientProps) {
  const articles = initialArticles;

  return (
    <>
      <HeroSection articles={articles.slice(0, 5)} />
      <LiveBanner />

      <AdBanner position="HEADER" className="my-2" />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom kiri: Berita Terkini + Trending dengan gambar */}
          <div className="lg:col-span-2">
            <BreakingSection
              articles={articles.slice(0, 4)}
              trendingArticles={initialTrending.length > 0 ? initialTrending : articles.slice(0, 5)}
            />
          </div>
          {/* Kolom kanan: Trending ringkas #6-10 */}
          <div>
            <TrendingSection
              articles={initialTrending.length > 0 ? initialTrending.slice(5, 15) : articles.slice(5, 15)}
            />
          </div>
        </div>
      </div>

      {/* Berita Pilihan */}
      <AdBanner position="IN_ARTICLE" className="my-2" />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Berita Pilihan</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {articles.slice(4, 12).map((a: any) => (
            <Link key={a.id} href={`/artikel/${a.slug}`} className="group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 mb-2">
                <ArticleImage
                  src={a.featuredImage}
                  alt={a.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  category={a.category?.slug}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[9px] font-bold uppercase text-white bg-blue-600 px-1.5 py-0.5 rounded">
                    {a.category?.name}
                  </span>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {a.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Berita Terbaru + Sidebar */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Berita Terbaru</h2>
            </div>
            <div className="space-y-4">
              {articles.slice(0, 15).map((a: any) => (
                <Link
                  key={a.id}
                  href={`/artikel/${a.slug}`}
                  className="group flex gap-4 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-800 transition-all"
                >
                  <div className="flex-shrink-0 relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <ArticleImage
                      src={a.featuredImage}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="128px"
                      category={a.category?.slug}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                      {a.category?.name}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors mt-0.5 leading-snug">
                      {a.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {a.publishedAt
                          ? new Date(a.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                          : "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {Number(a.viewCount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar — data sudah dari server, tidak ada fetch di client */}
          <aside className="space-y-6">
            <PopularArticles articles={popularArticles} />
            <NewsletterSection />
          </aside>
        </div>
      </div>

      {/* Baca Juga */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Baca Juga</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {articles.slice(15, 23).map((a: any) => (
            <Link key={a.id} href={`/artikel/${a.slug}`} className="group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 mb-2">
                <ArticleImage
                  src={a.featuredImage}
                  alt={a.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  category={a.category?.slug}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[9px] font-bold uppercase text-white/90 bg-emerald-600 px-1.5 py-0.5 rounded">
                    {a.category?.name}
                  </span>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {a.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
