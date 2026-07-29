"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Eye } from "lucide-react";

export default function PopularArticles() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/articles?limit=5&sort=views");
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
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-red-500" />
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Terpopuler</h2>
      </div>

      <ol className="space-y-4">
        {articles.map((item: any, index: number) => (
          <li key={item.id} className="flex gap-3">
            <span className={`flex-shrink-0 text-xl font-black w-7 ${index < 3 ? "text-red-500" : "text-gray-300 dark:text-gray-600"}`}>
              {index + 1}
            </span>
            <Link href={`/artikel/${item.slug}`} className="group flex-1 min-w-0">
              <h4 className="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {(item.viewCount || 0).toLocaleString()} views
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
