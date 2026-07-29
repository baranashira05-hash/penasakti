"use client";

import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface LatestNewsProps {
  articles?: any[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Berita Terbaru</h2>
        </div>
        <Link href="/pencarian" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Lihat Semua →
        </Link>
      </div>

      <div className="space-y-4">
        {articles.map((article: any) => (
          <Link
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="group flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all bg-white dark:bg-slate-800"
          >
            {/* Thumbnail */}
            {article.featuredImage && (
              <div className="flex-shrink-0 w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                <img src={getImageUrl(article.featuredImage)!} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                {article.category?.name || "Berita"}
              </span>
              <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 hidden sm:block">{article.excerpt}</p>
              )}
              <div className="flex items-center gap-3 mt-auto pt-2 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {(article.viewCount || 0).toLocaleString()}
                </span>
                {article.author?.name && <span>{article.author.name}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
