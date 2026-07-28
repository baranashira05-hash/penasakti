"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Megaphone, BarChart3, Users, Eye, MousePointer, Target,
  CheckCircle, ArrowRight, Star, Zap, Shield, Globe
} from "lucide-react";

const AD_PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    price: 500000,
    duration: "7 hari",
    position: "Sidebar",
    impressions: "~10.000",
    features: ["Posisi sidebar", "10K+ impressions", "Laporan dasar"],
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 1500000,
    duration: "14 hari",
    position: "Header + Sidebar",
    impressions: "~50.000",
    features: ["Posisi header & sidebar", "50K+ impressions", "Laporan lengkap", "A/B testing"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 5000000,
    duration: "30 hari",
    position: "Header + In-Article + Sidebar",
    impressions: "~200.000",
    features: ["Semua posisi", "200K+ impressions", "Laporan real-time", "Dedicated support", "Custom design"],
    popular: false,
  },
];

const STATS = [
  { icon: Users, label: "Pembaca Aktif", value: "2.5 Juta+" },
  { icon: Eye, label: "Pageviews/Bulan", value: "15 Juta+" },
  { icon: MousePointer, label: "Avg. CTR", value: "2.8%" },
  { icon: Globe, label: "Jangkauan", value: "Nasional" },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function PasangIklanPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Megaphone className="w-4 h-4" />
            <span className="text-sm font-medium">PenaSakti Ads</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Jangkau Jutaan Pembaca<br />dengan Iklan di PenaSakti
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Promosikan bisnis Anda ke 2.5 juta+ pembaca aktif. Iklan ditampilkan di portal berita terpercaya Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pasang-iklan/daftar"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
            >
              Mulai Beriklan <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#paket" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Lihat Paket Harga
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-center shadow-sm">
              <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Advertise */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">Mengapa Beriklan di PenaSakti?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Target Audience Tepat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pilih kategori berita yang sesuai dengan target pasar bisnis Anda untuk hasil maksimal.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Laporan Real-time</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pantau performa iklan Anda dengan dashboard lengkap: impressions, clicks, dan CTR.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Brand Safety</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Iklan Anda tampil di konten berkualitas yang telah melalui proses editorial ketat.</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="paket" className="bg-white dark:bg-slate-900 py-16 border-y border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">Paket Iklan</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10">Pilih paket yang sesuai dengan kebutuhan dan budget Anda</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {AD_PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`relative rounded-2xl border p-6 ${pkg.popular ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10 scale-105" : "border-gray-200 dark:border-slate-700"} bg-white dark:bg-slate-800`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Populer
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{pkg.position} • {pkg.duration}</p>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(pkg.price)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/{pkg.duration}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pkg.impressions} estimasi impressions</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pasang-iklan/daftar"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${pkg.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white"}`}
                >
                  Pilih Paket
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Zap className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Siap Meningkatkan Bisnis Anda?</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">Daftar sekarang dan mulai menjangkau jutaan pembaca PenaSakti dalam hitungan menit.</p>
        <Link href="/pasang-iklan/daftar" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors">
          Daftar Sebagai Advertiser <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
