"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle, XCircle, AlertTriangle, Clock, Flag, Search } from "lucide-react";

const DEMO_COMMENTS = [
  { id: "1", user: "Budi Santoso", article: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun", content: "Semoga stimulus ini benar-benar berdampak positif untuk rakyat kecil, bukan hanya untuk konglomerat.", status: "PENDING", time: "5 mnt lalu", reports: 0 },
  { id: "2", user: "Rina Kartika", article: "Timnas Indonesia Lolos Final Piala AFF 2026", content: "INDONESIA PASTI BISA! 🇮🇩🔥 Garuda Nusantara memang juara!", status: "APPROVED", time: "12 mnt lalu", reports: 0 },
  { id: "3", user: "Hacker123", article: "Apple Investasi di Indonesia", content: "Kunjungi situs saya untuk dapat uang gratis!!!", status: "SPAM", time: "30 mnt lalu", reports: 5 },
  { id: "4", user: "Anonymous", article: "Gempa Sulawesi Tengah", content: "Ini semua karena pemerintah tidak peduli!! @#$%!", status: "PENDING", time: "45 mnt lalu", reports: 2 },
  { id: "5", user: "Dewi Lestari", article: "Harga Emas Antam Naik", content: "Terima kasih infonya! Sangat membantu untuk keputusan investasi saya.", status: "APPROVED", time: "1 jam lalu", reports: 0 },
  { id: "6", user: "Joko Widodo", article: "Kebijakan BBM Baru", content: "Artikel yang sangat informatif dan berimbang. Terus berkarya PenaSakti!", status: "PENDING", time: "2 jam lalu", reports: 0 },
  { id: "7", user: "SiTroll", article: "DPR Setujui RUU", content: "Dasar penipu semua!!! Koruptor!!!!", status: "PENDING", time: "3 jam lalu", reports: 3 },
];

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
  APPROVED: { label: "Disetujui", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle },
  SPAM: { label: "Spam", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
};

export default function KomentarPage() {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? DEMO_COMMENTS : DEMO_COMMENTS.filter(c => c.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" /> Moderasi Komentar
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan moderasi komentar pembaca</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">1,892</p>
          <p className="text-xs text-gray-500">Total Komentar</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-600">24</p>
          <p className="text-xs text-gray-500">Pending Review</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-red-600">8</p>
          <p className="text-xs text-gray-500">Spam Terdeteksi</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-emerald-600">1,860</p>
          <p className="text-xs text-gray-500">Disetujui</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[{ key: "ALL", label: "Semua" }, { key: "PENDING", label: "Pending" }, { key: "APPROVED", label: "Disetujui" }, { key: "SPAM", label: "Spam" }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f.key ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-blue-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filtered.map(comment => {
          const statusConf = STATUS_CONFIG[comment.status];
          const StatusIcon = statusConf.icon;
          return (
            <div key={comment.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.user}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${statusConf.cls}`}>
                      <StatusIcon className="w-3 h-3" /> {statusConf.label}
                    </span>
                    {comment.reports > 0 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center gap-0.5">
                        <Flag className="w-3 h-3" /> {comment.reports} laporan
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                  <p className="text-[11px] text-gray-400">pada: <span className="text-gray-600 dark:text-gray-300">{comment.article}</span> • {comment.time}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-400 hover:text-emerald-600 transition-colors" title="Setujui">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors" title="Hapus">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
