/**
 * Canonical site URL
 *
 * PENTING: Vercel dikonfigurasi dengan www.penasakti.com sebagai primary domain.
 * penasakti.com (non-www) di-redirect 308 ke www.penasakti.com oleh Vercel.
 *
 * Semua metadata, og:image, sitemap, canonical link HARUS menggunakan www
 * agar tidak kena redirect saat crawler (WhatsApp, Google, Facebook) fetch URL.
 *
 * Untuk mengubah ini: buka Vercel Dashboard → Domains → set penasakti.com
 * sebagai primary (bukan www) → update kembali ke "https://penasakti.com"
 */

// Primary domain sesuai konfigurasi Vercel (www = primary, non-www = redirect)
export const SITE_URL = "https://www.penasakti.com";

// Alias untuk backward compatibility
export const CANONICAL_URL = SITE_URL;
export const BASE_URL = SITE_URL;

/**
 * Konversi URL gambar artikel menjadi URL proxy yang aman untuk og:image.
 *
 * Mengapa perlu proxy:
 * - postimg.cc, imgur.cc, dll memblokir hotlinking dari bot/crawler
 * - WhatsApp, Facebook, Telegram adalah bot — mereka di-block → gambar tidak muncul
 * - Dengan proxy via domain sendiri (www.penasakti.com), crawler selalu bisa akses
 *
 * URL yang sudah dari domain terpercaya (vercel blob, cloudinary) tidak di-proxy
 * karena mereka memang sudah public dan bebas diakses crawler.
 */
export function toOgImageUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;

  // URL relatif → absolute
  const url = rawUrl.startsWith("/") ? `${SITE_URL}${rawUrl}` : rawUrl;

  // Domain yang TIDAK perlu di-proxy (sudah crawler-friendly)
  const SAFE_DOMAINS = [
    "vercel-storage.com",    // Vercel Blob
    "blob.vercel-storage.com",
    "res.cloudinary.com",    // Cloudinary
    "cloudinary.com",
    "penasakti.com",         // Domain sendiri
    "www.penasakti.com",
  ];

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Sudah aman, tidak perlu proxy
    const isSafe = SAFE_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    );
    if (isSafe) {
      // Pastikan HTTPS
      return url.replace(/^http:\/\//, "https://");
    }

    // Domain eksternal (postimg.cc, imgur, dll) → route via proxy
    return `${SITE_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
  } catch {
    return null;
  }
}
