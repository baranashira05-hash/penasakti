"use client";

import { TrendingUp, TrendingDown, Eye, Users, FileText, DollarSign, MessageSquare, Star } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATS = [
  {
    label: "Total Views (30 hari)",
    value: 12485000,
    growth: 23.5,
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "Pengunjung Unik",
    value: 3240000,
    growth: 18.2,
    icon: Users,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    label: "Total Artikel",
    value: 24751,
    growth: 5.8,
    icon: FileText,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    label: "Pendapatan (Rp)",
    value: 84500000,
    growth: 12.1,
    icon: DollarSign,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    prefix: "Rp ",
  },
  {
    label: "Komentar Baru",
    value: 1247,
    growth: -3.2,
    icon: MessageSquare,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    label: "Total Penulis",
    value: 84,
    growth: 8.3,
    icon: Star,
    color: "text-pink-600",
    bg: "bg-pink-50 dark:bg-pink-950/30",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.growth >= 0;

        return (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
              <Icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-2xl font-black">
              {stat.prefix || ""}
              {formatNumber(stat.value)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {stat.label}
            </p>
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-semibold", isPositive ? "text-green-600" : "text-red-500")}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(stat.growth)}% vs bulan lalu
            </div>
          </div>
        );
      })}
    </div>
  );
}
