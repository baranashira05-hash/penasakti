"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, Users, Eye, TrendingUp, MessageSquare, DollarSign,
  BarChart3, Activity, Newspaper, Clock, CheckCircle, XCircle,
  AlertTriangle, Radio, Globe, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const STATS = [
  { label: "Total Artikel", value: "24,751", change: "+127", trend: "up", icon: FileText, color: "blue" },
  { label: "Artikel Hari Ini", value: "43", change: "+12", trend: "up", icon: Newspaper, color: "emerald" },
  { label: "Pengunjung Realtime", value: "8,432", change: "+2,341", trend: "up", icon: Activity, color: "purple" },
  { label: "Total Wartawan", value: "156", change: "+3", trend: "up", icon: Users, color: "amber" },
  { label: "Pendapatan Bulan Ini", value: "Rp 245.8M", change: "+18%", trend: "up", icon: DollarSign, color: "emerald" },
  { label: "Komentar Baru", value: "1,892", change: "+234", trend: "up", icon: MessageSquare, color: "sky" },
  { label: "Iklan Aktif", value: "67", change: "-2", trend: "down", icon: Globe, color: "orange" },
  { label: "Live Aktif", value: "2", change: "+1", trend: "up", icon: Radio, color: "red" },
];

const ARTICLE_STATS = [
  { label: "Published", value: 18420, color: "bg-emerald-500" },
  { label: "Pending Review", value: 342, color: "bg-amber-500" },
  { label: "Draft", value: 1250, color: "bg-gray-400" },
  { label: "Ditolak", value: 89, color: "bg-red-500" },
  { label: "Terjadwal", value: 156, color: "bg-blue-500" },
];

const TRENDING = [
  { id: 1, title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun", views: 125000, comments: 876, category: "Ekonomi" },
  { id: 2, title: "Timnas Indonesia Lolos Final Piala AFF 2026", views: 98000, comments: 1243, category: "Olahraga" },
  { id: 3, title: "Apple Investasi Rp 45 Triliun di Indonesia", views: 67000, comments: 432, category: "Teknologi" },
  { id: 4, title: "Gempa M5.8 Guncang Sulawesi Tengah", views: 54000, comments: 321, category: "Nasional" },
  { id: 5, title: "Harga Emas Antam Naik ke Rekor Tertinggi", views: 45000, comments: 198, category: "Ekonomi" },
];

const RECENT_ARTICLES = [
  { id: 1, title: "Peluncuran Satelit Nusantara-3 Sukses", author: "Ahmad Fauzi", status: "PUBLISHED", time: "5 mnt lalu" },
  { id: 2, title: "Rapat Kabinet Bahas Inflasi", author: "Siti Rahayu", status: "REVIEW", time: "12 mnt lalu" },
  { id: 3, title: "Liga 1: Persija Menang 3-1", author: "Budi Santoso", status: "PUBLISHED", time: "23 mnt lalu" },
  { id: 4, title: "Review iPhone 17 Pro Max", author: "Hendra W.", status: "DRAFT", time: "45 mnt lalu" },
  { id: 5, title: "Banjir Jakarta Selatan Meluas", author: "Dewi P.", status: "PUBLISHED", time: "1 jam lalu" },
];

const LIVE_REPORTERS = [
  { name: "Ahmad Fauzi", location: "Jakarta Pusat", status: "live", story: "Banjir Jakarta" },
  { name: "Rina Kartika", location: "Bandung", status: "live", story: "Gempa Susulan" },
  { name: "Dani Pratama", location: "Surabaya", status: "online", story: "-" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: "Tayang", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  REVIEW: { label: "Review", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  DRAFT: { label: "Draft", cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

function formatNum(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toString(); }

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400",
  orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang kembali, Admin PenaSakti</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            8,432 online
          </span>
          <Link href="/dashboard/artikel/baru" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
            + Buat Artikel
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${COLOR_MAP[stat.color]}`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] font-medium ${stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Article Status + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Article Pipeline */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Status Artikel</h3>
          <div className="space-y-3">
            {ARTICLE_STATS.map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          {/* Bar visualization */}
          <div className="flex h-3 rounded-full overflow-hidden mt-5 bg-gray-100 dark:bg-slate-700">
            {ARTICLE_STATS.map(s => (
              <div key={s.label} className={`${s.color} transition-all`} style={{ width: `${(s.value / 20257) * 100}%` }} />
            ))}
          </div>
        </div>

        {/* Visitor Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Statistik Pengunjung (7 Hari)</h3>
            <div className="flex gap-1">
              {["1H", "7H", "30H", "1T"].map(p => (
                <button key={p} className={`px-2.5 py-1 text-[11px] rounded-md font-medium ${p === "7H" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"}`}>{p}</button>
              ))}
            </div>
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-2 h-40 pt-4">
            {[65, 45, 78, 92, 58, 85, 100].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500/80 dark:bg-blue-400/80 rounded-t-md transition-all hover:bg-blue-600" style={{ height: `${v}%` }} />
                <span className="text-[10px] text-gray-400">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Total: 2.4M pageviews</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">↑ 12.5% vs minggu lalu</span>
          </div>
        </div>
      </div>

      {/* Trending + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trending */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" /> Trending Sekarang
            </h3>
          </div>
          <div className="space-y-3">
            {TRENDING.map((t, i) => (
              <div key={t.id} className="flex items-start gap-3">
                <span className={`text-lg font-black w-6 ${i < 3 ? "text-red-500" : "text-gray-300 dark:text-gray-600"}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{t.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    <span>{t.category}</span>
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{formatNum(t.views)}</span>
                    <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{t.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Artikel Terbaru</h3>
            <Link href="/dashboard/artikel" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Semua →</Link>
          </div>
          <div className="space-y-3">
            {RECENT_ARTICLES.map(a => (
              <div key={a.id} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{a.title}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{a.author} · {a.time}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_MAP[a.status]?.cls}`}>
                  {STATUS_MAP[a.status]?.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Reporters */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500" /> Reporter Aktif
          </h3>
          <Link href="/dashboard/live" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Kelola Live →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LIVE_REPORTERS.map(r => (
            <div key={r.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                  {r.name[0]}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${r.status === "live" ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="truncate">{r.location}</span>
                  {r.status === "live" && <span className="text-red-500 font-medium">• LIVE</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
          <p className="text-sm text-blue-100">Pendapatan Iklan</p>
          <p className="text-2xl font-bold mt-1">Rp 185.5M</p>
          <p className="text-xs text-blue-200 mt-2">↑ 23% dari bulan lalu</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-5 text-white">
          <p className="text-sm text-emerald-100">Pendapatan Store</p>
          <p className="text-2xl font-bold mt-1">Rp 42.3M</p>
          <p className="text-xs text-emerald-200 mt-2">↑ 45% dari bulan lalu</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-5 text-white">
          <p className="text-sm text-purple-100">Pendapatan Membership</p>
          <p className="text-2xl font-bold mt-1">Rp 18.0M</p>
          <p className="text-xs text-purple-200 mt-2">↑ 8% dari bulan lalu</p>
        </div>
      </div>
    </div>
  );
}
