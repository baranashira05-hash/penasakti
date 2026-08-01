"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdsForPosition } from "@/lib/ads-cache";

interface AdBannerProps {
  position: "HEADER" | "SIDEBAR" | "IN_ARTICLE" | "FOOTER" | "STICKY_BOTTOM" | "POPUP";
  className?: string;
}

const SIZE_MAP = {
  HEADER:        { label: "Leaderboard",      size: "728×90",  h: "h-[90px]",  w: "max-w-[728px]" },
  SIDEBAR:       { label: "Medium Rectangle", size: "300×250", h: "h-[250px]", w: "max-w-[300px]" },
  IN_ARTICLE:    { label: "In-Article",        size: "468×60",  h: "h-[60px]",  w: "max-w-[468px]" },
  FOOTER:        { label: "Leaderboard",      size: "970×90",  h: "h-[90px]",  w: "max-w-[970px]" },
  STICKY_BOTTOM: { label: "Mobile Banner",    size: "320×50",  h: "h-[50px]",  w: "max-w-[728px]" },
  POPUP:         { label: "Popup",            size: "300×250", h: "h-[250px]", w: "max-w-[300px]" },
};

export default function AdBanner({ position, className }: AdBannerProps) {
  const [adCode, setAdCode] = useState<string | null>(null);

  useEffect(() => {
    // Pakai shared cache — semua AdBanner di halaman berbagi satu fetch
    getAdsForPosition(position).then((ads) => {
      const code = ads[0]?.code;
      if (code) setAdCode(code);
    });
  }, [position]);

  const config = SIZE_MAP[position];

  if (adCode) {
    return (
      <div className={`w-full flex justify-center overflow-hidden ${className || ""}`} data-ad-position={position}>
        <div
          className={`${config.w} w-full overflow-hidden [&_img]:max-w-full [&_iframe]:max-w-full [&_iframe]:w-full`}
          dangerouslySetInnerHTML={{ __html: adCode }}
        />
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center overflow-hidden ${className || ""}`} data-ad-position={position}>
      <Link
        href="/pasang-iklan"
        className={`${config.w} w-full ${config.h} bg-gray-100 dark:bg-slate-800/50 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group overflow-hidden`}
      >
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
          {config.label}
        </span>
        <span className="text-[10px] text-gray-300 dark:text-gray-600">{config.size}</span>
      </Link>
    </div>
  );
}
