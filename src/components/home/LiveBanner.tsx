"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Radio, Eye, MapPin, ChevronRight } from "lucide-react";

const DEMO_LIVE = {
  title: "Breaking: Banjir Bandang Terjang Kota Bandung, Ratusan Warga Dievakuasi",
  slug: "banjir-bandang-bandung",
  locationName: "Bandung Selatan, Jawa Barat",
  reporterName: "Ahmad Fauzi",
  viewers: 3842,
  thumbnail: "https://picsum.photos/seed/livebanner/800/400",
  isBreaking: true,
  category: "Bencana",
};

export default function LiveBanner() {
  const [viewers, setViewers] = useState(DEMO_LIVE.viewers);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const i = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 5) - 1);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href={`/live`}
      className="block group"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-rose-800 p-4 md:p-5 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-shadow">
          {/* Background image */}
          <div className="absolute inset-0 opacity-20">
            <img src={DEMO_LIVE.thumbnail} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/90 via-red-700/70 to-transparent" />

          <div className="relative flex items-center gap-4">
            {/* Live badge */}
            <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-1">
              <span className="flex items-center gap-1.5 bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
              <span className="text-[10px] text-white/60">SEKARANG</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:hidden">
                <span className="flex items-center gap-1 bg-white/20 text-xs font-bold px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                </span>
                {DEMO_LIVE.isBreaking && (
                  <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">BREAKING</span>
                )}
              </div>
              <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:underline">
                {DEMO_LIVE.title}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-white/70 text-xs">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{DEMO_LIVE.locationName}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{viewers.toLocaleString()} menonton</span>
                <span className="hidden md:inline">Reporter: {DEMO_LIVE.reporterName}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
              <Radio className="w-4 h-4" />
              <span className="text-sm font-semibold hidden md:inline">Tonton Live</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
