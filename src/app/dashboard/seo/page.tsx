"use client";

import { Search, Globe, FileText, Link2, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const SEO_SCORE = [
  { page: "Homepage", score: 95, issues: 0, indexed: true },
  { page: "/kategori/nasional", score: 92, issues: 1, indexed: true },
  { page: "/kategori/ekonomi", score: 88, issues: 2, indexed: true },
  { page: "/artikel/presiden-stimulus", score: 97, issues: 0, indexed: true },
  { page: "/store", score: 78, issues: 3, indexed: false },
];

export default function SEOPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-emerald-600" /> SEO Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor dan optimasi SEO website</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "SEO Score", value: "92/100", color: "emerald" },
          { label: "Indexed Pages", value: "18,420", color: "blue" },
          { label: "Broken Links", value: "3", color: "red" },
          { label: "Avg. Position", value: "4.2", color: "amber" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Halaman & Skor SEO</h3>
        <div className="space-y-3">
          {SEO_SCORE.map(p => (
            <div key={p.page} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {p.indexed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{p.page}</p>
                  <p className="text-[10px] text-gray-400">{p.issues === 0 ? "Tidak ada masalah" : `${p.issues} masalah ditemukan`}</p>
                </div>
              </div>
              <div className={`text-sm font-bold ${p.score >= 90 ? "text-emerald-600" : p.score >= 80 ? "text-amber-600" : "text-red-600"}`}>
                {p.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
