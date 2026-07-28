"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Minus, Plus, Store, MapPin, Shield, Truck, ArrowLeft, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

const DEMO_PRODUCT = {
  id: "1",
  name: "Kaos PenaSakti Edisi Kemerdekaan 2026",
  slug: "kaos-penasakti-kemerdekaan",
  description: "Kaos premium edisi terbatas merayakan HUT RI ke-81. Bahan cotton combed 30s yang nyaman dan adem. Desain eksklusif dari tim kreatif PenaSakti dengan printing DTF berkualitas tinggi yang tahan lama.",
  price: 149000,
  comparePrice: 199000,
  images: [
    "https://picsum.photos/seed/proddet1/800/800",
    "https://picsum.photos/seed/proddet2/800/800",
    "https://picsum.photos/seed/proddet3/800/800",
  ],
  stock: 50,
  sold: 1250,
  rating: 4.8,
  ratingCount: 456,
  weight: 200,
  seller: { storeName: "Official PenaSakti Store", storeSlug: "official-penasakti", rating: 4.9, ratingCount: 2340, city: "Jakarta Selatan", storeLogo: null },
  category: { name: "Fashion", slug: "fashion" },
  reviews: [
    { id: "r1", userName: "Budi S.", rating: 5, comment: "Bahannya adem banget, printing-nya juga bagus. Recommended!", createdAt: "2026-07-20" },
    { id: "r2", userName: "Rina W.", rating: 4, comment: "Ukurannya pas, cuma pengirimannya agak lama. Tapi overall puas.", createdAt: "2026-07-18" },
    { id: "r3", userName: "Dani P.", rating: 5, comment: "Keren banget desainnya! Bangga pakai kaos PenaSakti.", createdAt: "2026-07-15" },
  ],
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function ProductDetailPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const product = DEMO_PRODUCT;

  const handleCheckout = async () => {
    setLoading(true);
    // In real app: redirect to checkout page
    toast.success("Mengarahkan ke halaman checkout...");
    setTimeout(() => {
      router.push(`/store/checkout?product=${product.id}&qty=${quantity}`);
    }, 500);
    setLoading(false);
  };

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/store" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Store
          </Link>
          <span>/</span>
          <Link href={`/store?category=${product.category.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">{product.category.name}</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200 truncate max-w-48">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-3">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-blue-500" : "border-gray-200 dark:border-slate-700"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{product.category.name}</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900 dark:text-white">{product.rating}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">({product.ratingCount} ulasan)</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{product.sold} terjual</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deskripsi Produk</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah:</span>
              <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-l-lg text-gray-600 dark:text-gray-300">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-r-lg text-gray-600 dark:text-gray-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Stok: {product.stock}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-70"
              >
                <ShoppingCart className="w-5 h-5" />
                Beli Sekarang
              </button>
              <button className="p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Seller Info */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{product.seller.storeName}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{product.seller.city}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{product.seller.rating}</span>
                  </div>
                </div>
                <Link href={`/store/seller/${product.seller.storeSlug}`} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Kunjungi Toko
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Pembayaran Aman</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>Pengiriman Cepat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ulasan Pembeli</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {review.userName[0]}
                    </div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{review.userName}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>}
                <p className="text-xs text-gray-400 mt-2">{review.createdAt}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
