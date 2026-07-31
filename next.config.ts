import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Domain yang diizinkan untuk Next.js Image Optimization
    remotePatterns: [
      // Semua https domain diizinkan — Next.js akan optimize & cache di CDN
      // Ini aman karena kita kontrol src di ArticleImage sebelum dikirim ke Image
      { protocol: "https", hostname: "**" },
      // Domain spesifik lain
      { protocol: "http",  hostname: "cdn.penasakti.com" },
    ],
    // Prioritaskan WebP/AVIF untuk ukuran file lebih kecil
    formats: ["image/webp", "image/avif"],
    // Device sizes yang realistis — kurangi dari 8 ke 5 ukuran
    deviceSizes: [640, 828, 1080, 1200, 1920],
    // Image sizes untuk gambar kecil (thumbnail, avatar, dll)
    imageSizes: [16, 32, 64, 128, 256],
    // Cache gambar di CDN Vercel selama 30 hari
    minimumCacheTTL: 2592000,
    // Nonaktifkan AVIF untuk performa encode yang lebih cepat di server
    // WebP sudah cukup bagus dan lebih cepat di-generate
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "framer-motion",
    ],
  },

  // Rewrite URL sitemap ber-titik ke route handler
  async rewrites() {
    return [
      { source: "/news-sitemap.xml",   destination: "/api/seo/news-sitemap" },
      { source: "/sitemap-index.xml",  destination: "/api/seo/sitemap-index" },
    ];
  },

  headers: async () => [
    // Security headers
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options",  value: "nosniff" },
        { key: "X-Frame-Options",          value: "SAMEORIGIN" },
        { key: "X-XSS-Protection",         value: "1; mode=block" },
        { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
    // Cache halaman artikel — ISR 5 menit, stale 10 menit
    {
      source: "/artikel/:slug*",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=600" }],
    },
    // Cache gambar yang di-optimize Next.js — sudah di-handle oleh Next.js sendiri
    // Tapi tambahkan header untuk static assets
    {
      source: "/_next/image(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    // Cache static JS/CSS chunks — immutable karena ada hash di nama file
    {
      source: "/_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    // Cache halaman kategori
    {
      source: "/kategori/:slug*",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" }],
    },
    // Cache sitemap
    {
      source: "/:path(sitemap\\.xml|news-sitemap\\.xml|robots\\.txt|sitemap-index\\.xml)",
      headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
    },
    // No cache untuk semua API route
    // (route /api/ads sudah override sendiri via res.headers.set di route handler)
    {
      source: "/api/:path*",
      headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
    },
  ],

  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,

  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
