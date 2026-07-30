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
      {/* Logo/Icon */}
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

function isValidSrc(src: string): boolean {
  // URL WordPress lama — tidak bisa diakses
  if (src.includes("penasakti.com/wp-content/uploads/")) return false;
  if (src.includes("/api/proxy-image")) return false;
  // Semua URL https yang valid
  if (src.startsWith("https://")) return true;
  if (src.startsWith("http://")) return true;
  if (src.startsWith("data:")) return true;
  if (src.startsWith("/")) return true;
  return false;
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
}: ArticleImageProps) {
  const [error, setError] = useState(false);

  if (!src || error || !isValidSrc(src)) {
    return <Placeholder category={category} />;
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        onError={() => setError(true)}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 600}
      height={height || 400}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
