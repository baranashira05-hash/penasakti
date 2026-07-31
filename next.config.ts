import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "penasakti.com" },
      { protocol: "https", hostname: "*.penasakti.com" },
      // CDN server lama WordPress (HTTP)
      { protocol: "http", hostname: "cdn.penasakti.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "i.postimg.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // cache gambar 24 jam
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
  // Rewrite URL sitemap ber-titik ke route handler yang clean
  // Ini diperlukan karena Next.js App Router tidak support folder dengan titik di nama
  async rewrites() {
    return [
      {
        source: "/news-sitemap.xml",
        destination: "/api/seo/news-sitemap",
      },
      {
        source: "/sitemap-index.xml",
        destination: "/api/seo/sitemap-index",
      },
    ];
  },
  headers: async () => [
    // Security headers untuk semua halaman
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
    // Cache artikel untuk Google crawler
    {
      source: "/artikel/:slug*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=300, stale-while-revalidate=600",
        },
      ],
    },
    // Cache berita (WordPress)
    {
      source: "/berita/:slug*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=600, stale-while-revalidate=1200",
        },
      ],
    },
    // Cache halaman kategori
    {
      source: "/kategori/:slug*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=60, stale-while-revalidate=300",
        },
      ],
    },
    // Cache sitemap
    {
      source: "/:path(sitemap\\.xml|news-sitemap\\.xml|robots\\.txt|sitemap-index\\.xml)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
    // No cache untuk API
    {
      source: "/api/(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store, must-revalidate" },
      ],
    },
  ],
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
