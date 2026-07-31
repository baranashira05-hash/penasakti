/**
 * ads-cache.ts
 *
 * Cache iklan di sisi client agar semua instance AdBanner
 * (HEADER, SIDEBAR, IN_ARTICLE, FOOTER, dst) berbagi satu fetch
 * per sesi halaman. Tanpa ini, setiap AdBanner membuat request
 * terpisah ke /api/ads saat mount.
 *
 * Cara kerja:
 * - Pertama kali dipanggil → fetch semua iklan aktif sekaligus
 * - Request berikutnya → ambil dari Map (in-memory, tidak ada network request)
 * - TTL 5 menit — cocok dengan revalidate homepage
 */

type AdPosition = "HEADER" | "SIDEBAR" | "IN_ARTICLE" | "FOOTER" | "STICKY_BOTTOM" | "POPUP";

interface Ad {
  id: string;
  code: string;
  position: AdPosition;
  [key: string]: unknown;
}

interface CacheEntry {
  data: Ad[];
  fetchedAt: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 menit

// Cache global — bertahan selama tab terbuka
let cache: CacheEntry | null = null;
// In-flight promise deduplicate — satu fetch untuk banyak komponen mount bersamaan
let inflightPromise: Promise<Ad[]> | null = null;

async function fetchAllAds(): Promise<Ad[]> {
  try {
    const res = await fetch("/api/ads?display=true", {
      // Biar browser cache juga ikut bantu (stale 5 menit)
      next: { revalidate: 300 },
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as Ad[]) || [];
  } catch {
    return [];
  }
}

/**
 * Ambil iklan untuk posisi tertentu.
 * Semua posisi berbagi satu network request per TTL.
 */
export async function getAdsForPosition(position: AdPosition): Promise<Ad[]> {
  const now = Date.now();

  // Masih dalam TTL → pakai cache
  if (cache && now - cache.fetchedAt < TTL_MS) {
    return cache.data.filter((ad) => ad.position === position);
  }

  // Sudah ada fetch yang sedang berjalan → tunggu daripada kirim request duplikat
  if (!inflightPromise) {
    inflightPromise = fetchAllAds().then((data) => {
      cache = { data, fetchedAt: Date.now() };
      inflightPromise = null;
      return data;
    });
  }

  const allAds = await inflightPromise;
  return allAds.filter((ad) => ad.position === position);
}

/** Invalidate cache manual (opsional, misal setelah admin update iklan) */
export function invalidateAdsCache(): void {
  cache = null;
}
