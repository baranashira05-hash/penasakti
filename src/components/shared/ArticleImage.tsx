"use client";

import { useState } from "react";
import Image from "next/image";

interface ArticleImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  category?: string;
  quality?: number;
}

const CATEGORY_CONFIG: Record<string, { bg: string; label: string }> = {
  nasional:       { bg: "bg-red-700",     label: "Nasional" },
  politik:        { bg: "bg-purple-700",  label: "Politik" },
  ekonomi:        { bg: "bg-emerald-700", label: "Ekonomi" },
  internasional:  { bg: "bg-blue-700",    label: "Internasional" },
  teknologi:      { bg: "bg-cyan-700",    label: "Teknologi" },
  pendidikan:     { bg: "bg-yellow-600",  label: "Pendidikan" },
  hukum:          { bg: "bg-rose-800",    label: "Hukum" },
  olahraga:       { bg: "bg-orange-600",  label: "Olahraga" },
  otomotif:       { bg: "bg-gray-600",    label: "Otomotif" },
  hiburan:        { bg: "bg-pink-600",    label: "Hiburan" },
  kesehatan:      { bg: "bg-teal-600",    label: "Kesehatan" },
  "berita-utama": { bg: "bg-red-800",     label: "Berita Utama" },
  default:        { bg: "bg-slate-700",   label: "Berita" },
};

function Placeholder({ category }: { category?: string }) {
  const key = category?.toLowerCase().replace(/\s+/g, "-") || "default";
  const cfg = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.default;

  return (
    <div className={`w-full h-full ${cfg.bg} flex flex-col items-center justify-center gap-2 select-none`}>
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">PenaSakti</span>
    </div>
  );
}

/**
 * Cek apakah URL valid untuk ditampilkan.
 * Hanya blokir URL wp-content dari server WordPress lama yang sudah mati.
 */
function isValidSrc(src: string): boolean {
  if (!src) return false;
  // Izinkan gambar dari hosting lama via IP (masih aktif)
  if (src.includes("103.163.139.88")) return true;
  // Blokir URL wp-content dari domain penasakti (sudah redirect ke Vercel)
  if (src.includes("penasakti.com/wp-content/uploads/")) return false;
  if (src.includes("cdn.penasakti.com/wp-content/")) return false;
  // Semua URL https/http/relatif/data valid
  return (
    src.startsWith("https://") ||
    src.startsWith("http://") ||
    src.startsWith("data:") ||
    src.startsWith("/")
  );
}

/**
 * Tentukan apakah perlu melalui Next.js Image Optimization (/_next/image).
 *
 * - Cloudinary: sudah punya CDN + transformasi sendiri → unoptimized=true
 *   (bypass Next.js agar tidak kena quota limit Vercel & tidak double-compress)
 * - Vercel Blob: sama, sudah di-serve via Vercel CDN → unoptimized=true
 * - URL internal (/): tetap di-optimize Next.js
 * - data: URI: tidak bisa di-optimize
 * - URL eksternal lain: di-optimize Next.js (via remotePatterns "**")
 */
function shouldBypassNextOptimization(src: string): boolean {
  // Cloudinary — sudah punya CDN global & auto-format
  if (src.includes("res.cloudinary.com")) return true;
  if (src.includes("cloudinary.com")) return true;
  // Vercel Blob — sudah di-serve via Vercel CDN
  if (src.includes("vercel-storage.com")) return true;
  if (src.includes("blob.vercel-storage.com")) return true;
  // data URI — tidak bisa di-optimize
  if (src.startsWith("data:")) return true;
  // proxy-image — URL sudah via server kita sendiri
  if (src.includes("/api/proxy-image")) return true;
  return false;
}

/**
 * Untuk Cloudinary: tambahkan transformasi otomatis f_auto,q_auto
 * agar Cloudinary serve format terbaik (WebP/AVIF) dengan kualitas optimal.
 * Ini menggantikan fungsi Next.js Image Optimization.
 */
function optimizeCloudinaryUrl(src: string): string {
  if (!src.includes("res.cloudinary.com")) return src;
  // Sudah ada transformasi → jangan tambah lagi
  if (src.includes("/f_auto") || src.includes("/q_auto")) return src;
  // Sisipkan f_auto,q_auto setelah /upload/
  return src.replace("/upload/", "/upload/f_auto,q_auto/");
}

export default function ArticleImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  category,
  quality = 75,
}: ArticleImageProps) {
  const [error, setError] = useState(false);

  if (!src || error || !isValidSrc(src)) {
    return <Placeholder category={category} />;
  }

  // Cloudinary: pakai transformasi Cloudinary langsung (lebih efisien)
  const finalSrc = optimizeCloudinaryUrl(src);
  const unoptimized = shouldBypassNextOptimization(finalSrc);

  const commonProps = {
    alt: alt || "Gambar artikel PenaSakti",
    title: alt || undefined,
    className,
    priority: priority ?? false,
    quality: unoptimized ? undefined : quality,
    unoptimized,
    onError: () => setError(true),
    loading: priority ? ("eager" as const) : ("lazy" as const),
  };

  if (fill) {
    return (
      <Image
        src={finalSrc}
        fill
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        {...commonProps}
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      width={width || 600}
      height={height || 400}
      sizes={sizes}
      {...commonProps}
    />
  );
}
