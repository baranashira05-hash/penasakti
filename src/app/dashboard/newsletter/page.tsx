"use client";

import { Mail, Users, Send, TrendingUp, Plus } from "lucide-react";

export default function NewsletterPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" /> Newsletter
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola subscriber dan kirim newsletter</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Buat Kampanye
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Subscriber", value: "24,521", icon: Users },
          { label: "Open Rate", value: "34.8%", icon: Mail },
          { label: "Click Rate", value: "12.3%", icon: TrendingUp },
          { label: "Email Terkirim", value: "156K", icon: Send },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <s.icon className="w-5 h-5 mb-2 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Kampanye Terakhir</h3>
        <div className="space-y-3">
          {[
            { name: "Weekly Digest - Minggu 4 Juli", sent: "24,521", opened: "8,534", clicked: "3,012", date: "28 Jul 2026" },
            { name: "Breaking: Stimulus Ekonomi 500T", sent: "24,521", opened: "15,234", clicked: "8,945", date: "28 Jul 2026" },
            { name: "Weekly Digest - Minggu 3 Juli", sent: "24,102", opened: "8,102", clicked: "2,876", date: "21 Jul 2026" },
          ].map(c => (
            <div key={c.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-[10px] text-gray-400">{c.date}</p>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Terkirim: <strong className="text-gray-900 dark:text-white">{c.sent}</strong></span>
                <span>Dibuka: <strong className="text-gray-900 dark:text-white">{c.opened}</strong></span>
                <span>Diklik: <strong className="text-gray-900 dark:text-white">{c.clicked}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
