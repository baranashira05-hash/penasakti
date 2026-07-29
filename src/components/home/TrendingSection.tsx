"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";

interface TrendingSectionProps {
  articles?: any[];
}

export default function TrendingSection({ articles: initialArticles }: TrendingSectionProps) {
  const [articles, setArticles] = useState<any[]>(initialArticles || []);

  useEffect(() => {
    if (articles.length > 0) return;
    async function load() {
      try {
        const res = await fetch("/api/articles?limit=10&sort=views");
        if (res.ok) {
          const json = await res.json();
          setArticles(json.data || []);
        }
      } catch {}
    }
    load();
  }, []);

  if (articles.length === 0) return null;

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
                    <Eye className="w-3 h-3" /> {(article.viewCount || 0).toLocaleString()} views
                  </span>
                </div>
              </div>
            </Link>
            {index < 9 && <div className="mt-3 border-b border-gray-100 dark:border-slate-700" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
