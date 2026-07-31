"use client";

import Link from "next/link";
import { Radio, Eye, MapPin, Play, ChevronRight } from "lucide-react";

const DEMO_LIVE = {
  title: "Breaking: Banjir Bandang Terjang Kota Bandung, Ratusan Warga Dievakuasi",
  slug: "banjir-bandang-bandung",
  locationName: "Bandung Selatan, Jawa Barat",
  reporterName: "Ahmad Fauzi",
  viewers: 3842,
  isBreaking: true,
  category: "Bencana",
};

export default function LiveBanner() {
  return (
    <div className="container mx-auto px-4 py-3 sm:py-4">
      <Link href="/live" className="block group">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all">
          {/* Content */}
          <div className="relative p-4 sm:p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            {/* Left: Live indicator */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Play className="w-7 h-7 fill-white ml-0.5" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full" />
              </div>
              <div className="md:hidden">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-white text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded">LIVE</span>
                  {DEMO_LIVE.isBreaking && (
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">BREAKING</span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle: Info */}
            <div className="flex-1 min-w-0">
              <div className="hidden md:flex items-center gap-2 mb-1.5">
                <span className="bg-white text-red-600 text-[10px] font-extrabold px-2.5 py-1 rounded">🔴 LIVE SEKARANG</span>
                {DEMO_LIVE.isBreaking && (
                  <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded">BREAKING NEWS</span>
                )}
                <span className="bg-white/20 text-[10px] font-medium px-2 py-1 rounded">{DEMO_LIVE.category}</span>
              </div>
              <h3 className="font-bold text-base md:text-lg leading-snug line-clamp-2 group-hover:underline decoration-2 underline-offset-2">
                {DEMO_LIVE.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/70 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-300" />
                  {DEMO_LIVE.locationName}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <strong className="text-white">{DEMO_LIVE.viewers.toLocaleString()}</strong> menonton
                </span>
                <span>Reporter: {DEMO_LIVE.reporterName}</span>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="hidden md:flex items-center gap-2 bg-white text-red-700 px-5 py-3 rounded-xl font-bold text-sm group-hover:bg-red-50 transition-colors flex-shrink-0">
              <Radio className="w-4 h-4" />
              Tonton Live
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
