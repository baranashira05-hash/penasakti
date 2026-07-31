"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";

interface TrendingSectionProps {
  articles?: any[];
}

export default function TrendingSection({ articles: initialArticles }: TrendingSectionProps) {
  const [articles, setArticles] = useState<any[]>(initialArticles || []);
  const [loading, setLoading] = useState(false);

  // Hanya fetch kalau tidak ada data dari server
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) return;
    async function load() {
      try {
        setLoading(true);
        let res = await fetch("/api/articles?limit=10&sort=views&status=PUBLISHED");
        if (res.ok) {
          const json = await res.json();
          const data = json.data || [];
          if (data.length > 0) { setArticles(data); setLoading(false); return; }
        }
        res = await fetch("/api/articles?limit=10&status=PUBLISHED");
        if (res.ok) {
          const json = await res.json();
          setArticles(json.data || []);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  // Skeleton loading
  if (loading) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trending Hari Ini</h2>
        </div>
        <ol className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <li key={i} className="flex items-start gap-3 animate-pulse">
              <span className="w-8 h-6 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/3 mt-1" />
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  // Fallback kalau benar-benar tidak ada data
  if (articles.length === 0) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trending Hari Ini</h2>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">Memuat berita trending...</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trending Hari Ini</h2>
      </div>

      <ol className="space-y-3">
        {articles.slice(0, 10).map((article: any, index: number) => (
          <li key={article.id}>
            <Link href={`/artikel/${article.slug}`} className="group flex items-start gap-3">
              <span className={`flex-shrink-0 text-2xl font-black leading-none mt-0.5 ${index < 3 ? "text-red-500" : "text-gray-300 dark:text-gray-600"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                    {article.category?.name || "BERITA"}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Eye className="w-3 h-3" /> {Number(article.viewCount || 0).toLocaleString()} views
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
    </section>
  );
}
