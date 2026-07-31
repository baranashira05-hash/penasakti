"use client";

/**
 * SocialSidebar — sticky social media buttons di sisi kanan layar
 * YouTube & TikTok PenaSakti
 * Hanya muncul di halaman publik (bukan dashboard)
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const YOUTUBE_URL = "https://www.youtube.com/@penasakticom";
const TIKTOK_URL  = "https://www.tiktok.com/@penasakti.com";

// Icon YouTube custom (merah khas YT)
function YouTubeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Icon TikTok custom
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

export default function SocialSidebar() {
  const pathname = usePathname();

  // Sembunyikan di halaman dashboard
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      {/* Desktop: kanan layar, vertical stack */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col"
        aria-label="Social media links"
      >
        {/* YouTube */}
        <Link
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ikuti PenaSakti di YouTube"
          title="YouTube PenaSakti"
          className="group flex items-center justify-end overflow-hidden bg-[#FF0000] text-white shadow-lg hover:shadow-xl transition-all duration-300 w-11 hover:w-36"
          style={{ borderRadius: "8px 0 0 8px", marginBottom: "2px" }}
        >
          {/* Label — muncul saat hover */}
          <span className="text-xs font-bold whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-3 pr-1">
            YouTube
          </span>
          {/* Icon selalu tampil */}
          <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
            <YouTubeIcon size={22} />
          </span>
        </Link>

        {/* TikTok */}
        <Link
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ikuti PenaSakti di TikTok"
          title="TikTok PenaSakti"
          className="group flex items-center justify-end overflow-hidden bg-[#010101] text-white shadow-lg hover:shadow-xl transition-all duration-300 w-11 hover:w-32"
          style={{ borderRadius: "8px 0 0 8px" }}
        >
          <span className="text-xs font-bold whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-3 pr-1">
            TikTok
          </span>
          <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
            <TikTokIcon size={20} />
          </span>
        </Link>
      </div>

      {/* Mobile: bottom bar pill kanan bawah */}
      <div
        className="fixed bottom-20 right-3 z-40 flex flex-col gap-2 sm:hidden"
        aria-label="Social media links"
      >
        <Link
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube PenaSakti"
          className="w-11 h-11 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <YouTubeIcon size={20} />
        </Link>
        <Link
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok PenaSakti"
          className="w-11 h-11 rounded-full bg-[#010101] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <TikTokIcon size={18} />
        </Link>
      </div>
    </>
  );
}
