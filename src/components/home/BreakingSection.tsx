"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function BreakingSection() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/articles?limit=4");
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
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-red-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Berita Terkini</h2>
        </div>
        <Link href="/pencarian" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Lihat Semua →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((article: any, index: number) => (
          <Link
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="group flex gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                {article.category?.name || "Berita"}
              </span>
              <h3 className="text-sm font-semibold line-clamp-2 mt-0.5 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
