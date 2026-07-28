"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText, Eye, Clock, CheckCircle, XCircle, AlertCircle,
  Award, PenLine, ArrowLeft, TrendingUp, Wallet, Star
} from "lucide-react";

const DEMO_ARTICLES = [
  { id: "1", title: "Pemerintah Percepat Digitalisasi UMKM di Pelosok Desa", status: "PUBLISHED", viewCount: 2450, publishedAt: "2026-07-25", reward: { earned: 100000, pending: 0 } },
  { id: "2", title: "Inovasi Petani Muda Gunakan Drone untuk Pertanian Presisi", status: "PUBLISHED", viewCount: 870, publishedAt: "2026-07-22", reward: { earned: 0, pending: 0 } },
  { id: "3", title: "Festival Budaya Nusantara 2026 Pecahkan Rekor Pengunjung", status: "REVIEW", viewCount: 0, publishedAt: null, reward: { earned: 0, pending: 0 } },
  { id: "4", title: "Tips Hemat Energi di Rumah Saat Musim Kemarau", status: "DRAFT", viewCount: 0, publishedAt: null, reward: { earned: 0, pending: 0 } },
];

const DEMO_REWARDS = {
  totalEarned: 100000,
  totalPending: 50000,
  history: [
    { id: "r1", article: "Pemerintah Percepat Digitalisasi UMKM di Pelosok Desa", amount: 50000, milestone: "1.000 viewers", status: "PAID", date: "2026-07-26" },
    { id: "r2", article: "Pemerintah Percepat Digitalisasi UMKM di Pelosok Desa", amount: 50000, milestone: "2.000 viewers", status: "PENDING", date: "2026-07-28" },
  ],
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  PUBLISHED: { label: "Tayang", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle },
  REVIEW: { label: "Dalam Review", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20", icon: Clock },
  DRAFT: { label: "Draft", color: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800", icon: FileText },
  REJECTED: { label: "Ditolak", color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20", icon: XCircle },
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function ArtikelSayaPage() {
  const { data: session, status: authStatus } = useSession();
  const [tab, setTab] = useState<"articles" | "rewards">("articles");

  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Diperlukan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Login untuk melihat artikel dan reward Anda.</p>
          <Link href="/login?redirect=/tulis-berita/artikel-saya" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/tulis-berita" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" /> Tulis Berita
          </Link>
          <Link href="/tulis-berita" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <PenLine className="w-4 h-4" /> Tulis Baru
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Artikel</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{DEMO_ARTICLES.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{DEMO_ARTICLES.reduce((s, a) => s + a.viewCount, 0).toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Reward Diterima</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(DEMO_REWARDS.totalEarned)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatPrice(DEMO_REWARDS.totalPending)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <button
            onClick={() => setTab("articles")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "articles" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
          >
            <FileText className="w-4 h-4" /> Artikel Saya
          </button>
          <button
            onClick={() => setTab("rewards")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "rewards" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
          >
            <Award className="w-4 h-4" /> Reward
          </button>
        </div>

        {/* Articles Tab */}
        {tab === "articles" && (
          <div className="space-y-3">
            {DEMO_ARTICLES.map((article) => {
              const statusConf = STATUS_CONFIG[article.status] || STATUS_CONFIG.DRAFT;
              const StatusIcon = statusConf.icon;
              return (
                <div key={article.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{article.title}</h3>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusConf.color}`}>
                          <StatusIcon className="w-3 h-3" /> {statusConf.label}
                        </span>
                        {article.viewCount > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {article.viewCount.toLocaleString()} views
                          </span>
                        )}
                        {article.publishedAt && (
                          <span className="text-xs text-gray-400">{article.publishedAt}</span>
                        )}
                      </div>
                      {article.reward.earned > 0 && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                          <Award className="w-3 h-3" /> Reward: {formatPrice(article.reward.earned)}
                        </p>
                      )}
                      {article.viewCount > 0 && article.viewCount < 1000 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                            <span>{article.viewCount}/1.000 viewers</span>
                            <span>Reward berikutnya: Rp 50.000</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(article.viewCount / 1000) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rewards Tab */}
        {tab === "rewards" && (
          <div className="space-y-4">
            {/* Reward Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500" /> Cara Kerja Reward
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                <li>✓ Setiap 1.000 viewers pada artikel Anda = <strong>Rp 50.000</strong></li>
                <li>✓ Reward berlaku kelipatan (3.000 viewers = Rp 150.000)</li>
                <li>✓ Pencairan dilakukan setiap minggu ke rekening terdaftar</li>
                <li>✓ Status reward bisa dicek di halaman ini</li>
              </ul>
            </div>

            {/* Reward History */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Riwayat Reward</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {DEMO_REWARDS.history.map((r) => (
                  <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{r.article}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{r.milestone} • {r.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(r.amount)}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${r.status === "PAID" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"}`}>
                        {r.status === "PAID" ? "Dibayar" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
