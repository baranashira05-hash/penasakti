"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Users, Eye, TrendingUp, MessageSquare, DollarSign,
  BarChart3, Activity, Clock, Radio, ArrowUpRight
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ articles: 0, categories: 0, users: 0 });
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch real article count and latest articles
        const [articlesRes, debugRes] = await Promise.all([
          fetch("/api/articles?limit=10"),
          fetch("/api/debug-env"),
        ]);

        if (articlesRes.ok) {
          const data = await articlesRes.json();
          setArticles(data.data || []);
          setStats(s => ({ ...s, articles: data.meta?.total || 0 }));
        }

        if (debugRes.ok) {
          const debug = await debugRes.json();
          setStats(s => ({ ...s, articles: debug.articleCount || s.articles }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const STAT_CARDS = [
    { label: "Total Artikel", value: stats.articles.toLocaleString(), icon: FileText, color: "blue" },
    { label: "Artikel Tayang", value: stats.articles.toLocaleString(), icon: Activity, color: "emerald" },
    { label: "Total Views", value: "0", icon: Eye, color: "purple" },
    { label: "Kategori", value: "-", icon: BarChart3, color: "amber" },
  ];

  const COLOR_MAP: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang, Admin PenaSakti</p>
        </div>
        <Link href="/dashboard/artikel/baru" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          + Buat Artikel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${COLOR_MAP[stat.color]}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {loading ? "..." : stat.value}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Artikel Terbaru</h3>
          <Link href="/dashboard/artikel" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Semua →</Link>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400 py-4 text-center">Memuat...</p>
        ) : articles.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Belum ada artikel</p>
        ) : (
          <div className="space-y-3">
            {articles.slice(0, 8).map((a: any) => (
              <div key={a.id} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{a.title}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {a.author?.name || "Redaksi"} · {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Tayang
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
