"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Star, Filter, Grid3X3, LayoutList, Store, ChevronRight } from "lucide-react";

const DEMO_CATEGORIES = [
  { id: "1", name: "Elektronik", slug: "elektronik", icon: "💻" },
  { id: "2", name: "Fashion", slug: "fashion", icon: "👕" },
  { id: "3", name: "Makanan", slug: "makanan", icon: "🍜" },
  { id: "4", name: "Buku", slug: "buku", icon: "📚" },
  { id: "5", name: "Kesehatan", slug: "kesehatan", icon: "💊" },
  { id: "6", name: "Olahraga", slug: "olahraga", icon: "⚽" },
  { id: "7", name: "Otomotif", slug: "otomotif", icon: "🚗" },
  { id: "8", name: "Rumah Tangga", slug: "rumah-tangga", icon: "🏠" },
];

const DEMO_PRODUCTS = [
  { id: "1", name: "Kaos PenaSakti Edisi Kemerdekaan", slug: "kaos-penasakti-kemerdekaan", price: 149000, comparePrice: 199000, image: "https://picsum.photos/seed/prod1/400/400", seller: "Official PenaSakti", rating: 4.8, sold: 1250, city: "Jakarta" },
  { id: "2", name: "Buku Jurnalisme Digital Modern", slug: "buku-jurnalisme-digital", price: 89000, comparePrice: null, image: "https://picsum.photos/seed/prod2/400/400", seller: "Toko Buku Nusantara", rating: 4.9, sold: 834, city: "Bandung" },
  { id: "3", name: "Mug Premium PenaSakti", slug: "mug-premium-penasakti", price: 75000, comparePrice: 99000, image: "https://picsum.photos/seed/prod3/400/400", seller: "Official PenaSakti", rating: 4.7, sold: 2100, city: "Jakarta" },
  { id: "4", name: "Tas Laptop Jurnalis 15 inch", slug: "tas-laptop-jurnalis", price: 349000, comparePrice: 450000, image: "https://picsum.photos/seed/prod4/400/400", seller: "BagStore ID", rating: 4.6, sold: 567, city: "Surabaya" },
  { id: "5", name: "Kopi Arabika Toraja Premium 250g", slug: "kopi-arabika-toraja", price: 95000, comparePrice: null, image: "https://picsum.photos/seed/prod5/400/400", seller: "Kopi Nusantara", rating: 4.9, sold: 3420, city: "Makassar" },
  { id: "6", name: "Topi Snapback PenaSakti", slug: "topi-snapback-penasakti", price: 125000, comparePrice: 150000, image: "https://picsum.photos/seed/prod6/400/400", seller: "Official PenaSakti", rating: 4.5, sold: 890, city: "Jakarta" },
  { id: "7", name: "Headset Gaming Bluetooth", slug: "headset-gaming-bluetooth", price: 259000, comparePrice: 350000, image: "https://picsum.photos/seed/prod7/400/400", seller: "TechZone", rating: 4.4, sold: 1567, city: "Tangerang" },
  { id: "8", name: "Batik Tulis Pekalongan", slug: "batik-tulis-pekalongan", price: 450000, comparePrice: 600000, image: "https://picsum.photos/seed/prod8/400/400", seller: "Batik Heritage", rating: 4.8, sold: 234, city: "Pekalongan" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-200">PenaSakti Store</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Belanja Produk Berkualitas</h1>
            <p className="text-blue-100 text-lg mb-6">Temukan produk terbaik dari seller terpercaya. Transaksi aman & mudah.</p>
            
            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk, toko, atau kategori..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 text-sm"
              />
            </div>
          </div>

          {/* Seller CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/store/seller/register" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              <Store className="w-4 h-4" /> Mulai Berjualan
            </Link>
            <Link href="/store/seller/dashboard" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Dashboard Seller <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kategori</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {DEMO_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/store?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all text-center"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Produk Populer</h2>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              <option value="newest">Terbaru</option>
              <option value="popular">Terlaris</option>
              <option value="cheapest">Termurah</option>
              <option value="expensive">Termahal</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DEMO_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/store/product/${product.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.comparePrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-base font-bold text-red-600 dark:text-red-400">
                  {formatPrice(product.price)}
                </p>
                {product.comparePrice && (
                  <p className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {product.rating}
                  </span>
                  <span>•</span>
                  <span>{product.sold} terjual</span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">{product.city}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Transaksi Aman</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pembayaran diproses melalui Duitku yang terjamin aman</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Seller Terverifikasi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Semua penjual telah melalui proses verifikasi ketat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Berjualan Mudah</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daftar sebagai seller dan mulai jual produkmu sekarang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
