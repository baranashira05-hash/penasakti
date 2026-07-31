"use client";

import Link from "next/link";
import { Clock, TrendingUp, Eye, Flame } from "lucide-react";
import ArticleImage from "@/components/shared/ArticleImage";

interface BreakingSectionProps {
  articles?: any[];
  trendingArticles?: any[];
}

export default function BreakingSection({ articles = [], trendingArticles = [] }: BreakingSectionProps) {
  return (
    <div className="space-y-6">
      {/* ===== BERITA TERKINI - maks 4 ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Berita Terkini</h2>
          </div>
          <Link href="/pencarian" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Lihat Semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {articles.slice(0, 4).map((article: any, index: number) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group flex gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  {article.category?.name || "Berita"}
                </span>
                <h3 className="text-sm font-semibold line-clamp-2 mt-0.5 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                    : "-"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== TRENDING HARI INI dengan gambar ===== */}
      {trendingArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Trending Hari Ini</h2>
          </div>

          {/* Artikel trending pertama — hero besar */}
          <Link
            href={`/artikel/${trendingArticles[0].slug}`}
            className="group block mb-3 rounded-xl overflow-hidden relative aspect-[16/7] bg-gray-200 dark:bg-slate-700"
          >
            <ArticleImage
              src={trendingArticles[0].featuredImage}
              alt={trendingArticles[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 66vw"
              category={trendingArticles[0].category?.slug}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  #1 Trending
                </span>
                <span className="text-white/70 text-[10px] font-medium uppercase">
                  {trendingArticles[0].category?.name}
                </span>
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-yellow-300 transition-colors">
                {trendingArticles[0].title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-white/60 text-[11px]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {Number(trendingArticles[0].viewCount || 0).toLocaleString()} views
                </span>
              </div>
            </div>
          </Link>

          {/* Artikel trending 2–5 — grid dengan gambar */}
          <div className="grid grid-cols-2 gap-3">
            {trendingArticles.slice(1, 5).map((article: any, index: number) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group flex gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-orange-300 hover:shadow-sm transition-all"
              >
                {/* Gambar kecil */}
                <div className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                  <ArticleImage
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                    category={article.category?.slug}
                  />
                  {/* Nomor ranking */}
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                    {index + 2}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase text-orange-500">
                    {article.category?.name || "Berita"}
                  </span>
                  <h3 className="text-xs font-semibold line-clamp-3 mt-0.5 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-1">
                    <Eye className="w-3 h-3" />
                    {Number(article.viewCount || 0).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
