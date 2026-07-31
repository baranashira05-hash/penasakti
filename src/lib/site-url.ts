/**
 * Canonical site URL — SELALU https://penasakti.com
 *
 * PENTING: Jangan pernah menggunakan NEXT_PUBLIC_APP_URL langsung
 * di file yang menghasilkan metadata, sitemap, atau canonical URL.
 * Selalu gunakan SITE_URL dari file ini.
 *
 * Alasan: Vercel men-set NEXT_PUBLIC_APP_URL ke penasakti.vercel.app
 * pada deployment jika tidak di-override manual di
 * Vercel Dashboard → Settings → Environment Variables.
 */

// Hard-coded canonical URL — tidak boleh diubah
export const SITE_URL = "https://penasakti.com";

// Alias untuk backward compatibility
export const CANONICAL_URL = SITE_URL;
export const BASE_URL = SITE_URL;
