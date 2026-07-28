"use client";

import { Wallet, TrendingUp, DollarSign, CreditCard, Download, ArrowUpRight } from "lucide-react";

export default function KeuanganPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" /> Keuangan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Laporan pendapatan dan keuangan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-slate-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors">
          <Download className="w-4 h-4" /> Export Laporan
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pendapatan Bulan Ini", value: "Rp 245.8M", change: "+18%", color: "emerald" },
          { label: "Pendapatan Iklan", value: "Rp 185.5M", change: "+23%", color: "blue" },
          { label: "Pendapatan Store (10%)", value: "Rp 42.3M", change: "+45%", color: "purple" },
          { label: "Pendapatan Membership", value: "Rp 18.0M", change: "+8%", color: "amber" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-gray-500">{s.label}</p>
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" />{s.change}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Pendapatan 6 Bulan Terakhir</h3>
          <div className="flex items-end gap-3 h-40">
            {[120, 145, 178, 165, 210, 245].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[9px] text-gray-400">{v}M</p>
                <div className="w-full bg-emerald-500/80 rounded-t-md" style={{ height: `${(v / 250) * 100}%` }} />
                <span className="text-[9px] text-gray-400">{["Feb", "Mar", "Apr", "Mei", "Jun", "Jul"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Transaksi Terakhir</h3>
          <div className="space-y-3">
            {[
              { desc: "Pembayaran Iklan - Tokopedia", amount: "+Rp 15.0M", date: "28 Jul", type: "income" },
              { desc: "Pencairan Reward Kontributor", amount: "-Rp 2.5M", date: "27 Jul", type: "expense" },
              { desc: "Pembayaran Iklan - Shopee", amount: "+Rp 10.0M", date: "26 Jul", type: "income" },
              { desc: "Biaya Server & Hosting", amount: "-Rp 3.2M", date: "25 Jul", type: "expense" },
              { desc: "Fee Store - Juli Week 3", amount: "+Rp 8.5M", date: "24 Jul", type: "income" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{t.desc}</p>
                  <p className="text-[10px] text-gray-400">{t.date}</p>
                </div>
                <span className={`text-xs font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
