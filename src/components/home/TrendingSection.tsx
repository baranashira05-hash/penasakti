"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";
import AdBanner from "@/components/shared/AdBanner";

interface TrendingSectionProps {
  articles?: any[];
}

export default function TrendingSection({ articles: initialArticles }: TrendingSectionProps) {
  const [articles, setArticles] = useState<any[]>(initialArticles || []);

  // Hanya fetch kalau tidak ada data dari server
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) return;
    async function load() {
      try {
        const res = await fetch("/api/articles?limit=10&sort=views&status=PUBLISHED");
        if (res.ok) {
          const json = await res.json();
          setArticles(json.data || []);
        }
      } catch {}
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      {/* List Trending */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-red-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Trending Lainnya</h2>
        </div>

        {articles.length === 0 ? (
          <ol className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <li key={i} className="flex items-start gap-3 animate-pulse">
                <span className="w-6 h-5 bg-gray-200 dark:bg-slate-700 rounded flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="space-y-3">
            {articles.slice(0, 10).map((article: any, index: number) => (
              <li key={article.id}>
                <Link href={`/artikel/${article.slug}`} className="group flex items-start gap-2.5">
                  <span className={`flex-shrink-0 text-xl font-black leading-none mt-0.5 w-7 text-right ${
                    index < 3 ? "text-red-500" : "text-gray-300 dark:text-gray-600"
                  }`}>
                    {String(index + 6).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400 truncate">
                        {article.category?.name || "BERITA"}
                      </span>
                      <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        {Number(article.viewCount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
                {index < articles.slice(0, 10).length - 1 && (
                  <div className="mt-3 border-b border-gray-100 dark:border-slate-700" />
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Kolom Iklan di bawah Trending Lainnya */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="px-3 pt-2.5 pb-1 border-b border-gray-100 dark:border-slate-700">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Iklan / Advertisement</span>
        </div>
        <div className="p-2">
          <AdBanner position="SIDEBAR" className="!justify-start" />
        </div>
      </div>
    </div>
  );
}
