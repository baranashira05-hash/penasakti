"use client";

import Link from "next/link";
import {
  ShoppingBag, Package, TrendingUp, DollarSign, Users,
  Eye, Star, ArrowUpRight, MoreHorizontal
} from "lucide-react";

const STATS = [
  { label: "Total Produk", value: "1,247", change: "+23", icon: Package, color: "blue" },
  { label: "Total Seller", value: "89", change: "+5", icon: Users, color: "purple" },
  { label: "Penjualan Bulan Ini", value: "Rp 42.3M", change: "+45%", icon: DollarSign, color: "emerald" },
  { label: "Fee Platform (10%)", value: "Rp 4.23M", change: "+45%", icon: TrendingUp, color: "amber" },
];

const RECENT_ORDERS = [
  { id: "PS-2807-A1", product: "Kaos PenaSakti Kemerdekaan", buyer: "Budi S.", amount: 149000, status: "PAID", date: "28 Jul" },
  { id: "PS-2807-A2", product: "Buku Jurnalisme Digital", buyer: "Rina W.", amount: 89000, status: "PROCESSING", date: "28 Jul" },
  { id: "PS-2807-A3", product: "Mug Premium PenaSakti", buyer: "Dani P.", amount: 75000, status: "SHIPPED", date: "28 Jul" },
  { id: "PS-2707-B1", product: "Tas Laptop Jurnalis", buyer: "Siti A.", amount: 349000, status: "DELIVERED", date: "27 Jul" },
  { id: "PS-2707-B2", product: "Kopi Arabika Toraja", buyer: "Hendra", amount: 95000, status: "COMPLETED", date: "27 Jul" },
];

const TOP_SELLERS = [
  { name: "Official PenaSakti Store", products: 45, sales: 12500, revenue: "Rp 18.5M", rating: 4.9 },
  { name: "Toko Buku Nusantara", products: 120, sales: 8340, revenue: "Rp 12.3M", rating: 4.8 },
  { name: "Kopi Nusantara", products: 15, sales: 6200, revenue: "Rp 8.1M", rating: 4.9 },
  { name: "BagStore ID", products: 67, sales: 3400, revenue: "Rp 5.6M", rating: 4.6 },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Dibayar", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  PROCESSING: { label: "Diproses", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  SHIPPED: { label: "Dikirim", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  DELIVERED: { label: "Diterima", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  COMPLETED: { label: "Selesai", cls: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
};

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function DashboardStorePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" /> Manajemen Store
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola produk, seller, dan pesanan PenaSakti Store</p>
        </div>
        <Link href="/store" target="_blank" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Lihat Store →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_MAP[stat.color]}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Pesanan Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Produk</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">Pembeli</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {RECENT_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="py-2.5 text-xs font-mono text-gray-500 dark:text-gray-400">{order.id}</td>
                    <td className="py-2.5 font-medium text-gray-900 dark:text-white text-xs max-w-32 truncate">{order.product}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-400 text-xs hidden sm:table-cell">{order.buyer}</td>
                    <td className="py-2.5 text-right text-xs font-medium text-gray-900 dark:text-white">{formatPrice(order.amount)}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_MAP[order.status]?.cls}`}>
                        {STATUS_MAP[order.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Top Seller</h3>
          <div className="space-y-3">
            {TOP_SELLERS.map((seller, i) => (
              <div key={seller.name} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-5 ${i < 3 ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{seller.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{seller.products} produk · {seller.sales.toLocaleString()} terjual</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{seller.revenue}</p>
                  <p className="text-[10px] text-gray-400 flex items-center justify-end gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{seller.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
