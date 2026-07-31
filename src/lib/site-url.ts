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
 * - penasakti.com/wp-content/uploads/ mengarah ke server WordPress lama yang sudah mati
 * - WhatsApp, Facebook, Telegram adalah bot — gambar tidak bisa diakses → tidak muncul
 * - Dengan proxy via www.penasakti.com, crawler selalu bisa akses
 *
 * URL yang tidak perlu di-proxy: Vercel Blob, Cloudinary (selalu public & crawler-friendly)
 */
export function toOgImageUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;

  // URL relatif → absolute
  const url = rawUrl.startsWith("/") ? `${SITE_URL}${rawUrl}` : rawUrl;

  // Domain yang TIDAK perlu di-proxy (selalu public, crawler-friendly)
  const SAFE_DOMAINS = [
    "vercel-storage.com",         // Vercel Blob
    "blob.vercel-storage.com",
    "res.cloudinary.com",         // Cloudinary
    "cloudinary.com",
  ];

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // URL dari penasakti.com/wp-content/ → server WordPress lama (mati)
    // Harus di-proxy agar bisa diakses, server lama masih hidup via cdn.penasakti.com
    const isWpContent = pathname.startsWith("/wp-content/");
    if (isWpContent) {
      // Ubah ke cdn.penasakti.com (HTTP, server Jagoan Hosting lama masih hidup)
      // lalu proxy via endpoint kita supaya jadi HTTPS
      const cdnUrl = `http://cdn.penasakti.com${pathname}`;
      return `${SITE_URL}/api/proxy-image?url=${encodeURIComponent(cdnUrl)}`;
    }

    // Vercel Blob & Cloudinary → aman, tidak perlu proxy
    const isSafe = SAFE_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    );
    if (isSafe) {
      return url.replace(/^http:\/\//, "https://");
    }

    // Domain penasakti.com sendiri (bukan wp-content) → aman, pastikan HTTPS www
    if (hostname === "penasakti.com" || hostname === "www.penasakti.com") {
      return url
        .replace("https://penasakti.com", "https://www.penasakti.com")
        .replace("http://penasakti.com", "https://www.penasakti.com")
        .replace("http://www.penasakti.com", "https://www.penasakti.com");
    }

    // cdn.penasakti.com (HTTP CDN lama) → proxy agar jadi HTTPS
    if (hostname === "cdn.penasakti.com") {
      return `${SITE_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
    }

    // Domain eksternal lainnya (postimg.cc, imgur, dll) → proxy
    return `${SITE_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
  } catch {
    return null;
  }
}
