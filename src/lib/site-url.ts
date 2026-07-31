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
