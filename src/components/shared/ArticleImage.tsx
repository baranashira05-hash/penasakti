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

const CATEGORY_GRADIENTS: Record<string, string> = {
  nasional:       "from-red-700 to-red-500",
  politik:        "from-purple-700 to-purple-500",
  ekonomi:        "from-emerald-700 to-emerald-500",
  internasional:  "from-blue-700 to-blue-500",
  teknologi:      "from-cyan-700 to-cyan-500",
  pendidikan:     "from-yellow-600 to-yellow-400",
  hukum:          "from-rose-800 to-rose-600",
  olahraga:       "from-orange-600 to-orange-400",
  otomotif:       "from-gray-600 to-gray-400",
  hiburan:        "from-pink-600 to-pink-400",
  kesehatan:      "from-teal-600 to-teal-400",
  default:        "from-slate-600 to-slate-400",
};

function Placeholder({ alt, category }: { alt: string; category?: string }) {
  const key = category?.toLowerCase() || "default";
  const gradient = CATEGORY_GRADIENTS[key] || CATEGORY_GRADIENTS.default;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}>
      <svg className="w-8 h-8 text-white/30 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6" />
      </svg>
      <span className="text-white/25 text-[9px] font-bold uppercase tracking-widest">PenaSakti</span>
    </div>
  );
}

// Cek apakah URL bisa dipakai atau tidak
function isValidImageUrl(src: string): boolean {
  if (!src) return false;
  // URL dari WordPress lama — server sudah tidak bisa diakses
  if (src.includes("penasakti.com/wp-content/uploads/")) return false;
  if (src.includes("/api/proxy-image")) return false;
  // URL yang valid
  return src.startsWith("http") || src.startsWith("/");
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

  const valid = !error && src && isValidImageUrl(src);

  if (!valid) {
    return <Placeholder alt={alt} category={category} />;
  }

  if (fill) {
    return (
      <Image
        src={src!}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setError(true)}
        unoptimized={src!.startsWith("http") && !src!.includes("res.cloudinary.com") && !src!.includes("vercel-storage")}
      />
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      width={width || 600}
      height={height || 400}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      unoptimized={src!.startsWith("http") && !src!.includes("res.cloudinary.com")}
    />
  );
}
