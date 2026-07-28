"use client";

import { Megaphone, Eye, MousePointer, DollarSign, TrendingUp, Plus, BarChart3 } from "lucide-react";

const AD_CAMPAIGNS = [
  { id: "1", name: "Tokopedia - Promo 7.7", position: "Header", status: "ACTIVE", impressions: 245000, clicks: 6800, ctr: 2.78, budget: 15000000, spent: 8500000, startDate: "1 Jul", endDate: "31 Jul" },
  { id: "2", name: "Shopee - Flash Sale", position: "Sidebar", status: "ACTIVE", impressions: 189000, clicks: 4200, ctr: 2.22, budget: 10000000, spent: 6200000, startDate: "15 Jul", endDate: "15 Aug" },
  { id: "3", name: "BCA - KPR Digital", position: "In-Article", status: "ACTIVE", impressions: 156000, clicks: 3100, ctr: 1.99, budget: 20000000, spent: 12000000, startDate: "1 Jul", endDate: "30 Sep" },
  { id: "4", name: "Telkomsel - 5G Launch", position: "Footer", status: "PAUSED", impressions: 98000, clicks: 1500, ctr: 1.53, budget: 8000000, spent: 4500000, startDate: "10 Jul", endDate: "10 Aug" },
  { id: "5", name: "GoTo - IPO Anniversary", position: "Header", status: "COMPLETED", impressions: 450000, clicks: 12300, ctr: 2.73, budget: 25000000, spent: 25000000, startDate: "1 Jun", endDate: "30 Jun" },
];

const STATUS_MAP: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PAUSED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  COMPLETED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

function formatPrice(n: number) { return "Rp " + (n / 1000000).toFixed(1) + "M"; }

export default function IklanPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-purple-600" /> Manajemen Iklan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola kampanye iklan dan performa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Buat Kampanye
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Impressi", value: "1.14M", icon: Eye, color: "blue" },
          { label: "Total Klik", value: "27,900", icon: MousePointer, color: "emerald" },
          { label: "Avg. CTR", value: "2.45%", icon: TrendingUp, color: "amber" },
          { label: "Pendapatan", value: "Rp 78M", icon: DollarSign, color: "purple" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <s.icon className={`w-5 h-5 mb-2 text-${s.color}-600 dark:text-${s.color}-400`} />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Kampanye</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Posisi</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Impressi</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Klik</th>
                <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">CTR</th>
                <th className="text-right px-4 py-3 font-medium">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {AD_CAMPAIGNS.map(ad => (
                <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white text-xs">{ad.name}</p>
                    <p className="text-[10px] text-gray-400">{ad.startDate} - {ad.endDate}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 hidden md:table-cell">{ad.position}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_MAP[ad.status]}`}>{ad.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-700 dark:text-gray-300 hidden sm:table-cell">{ad.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-700 dark:text-gray-300 hidden sm:table-cell">{ad.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs font-medium text-emerald-600 hidden lg:table-cell">{ad.ctr}%</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{formatPrice(ad.budget)}</p>
                    <p className="text-[10px] text-gray-400">Terpakai: {formatPrice(ad.spent)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
