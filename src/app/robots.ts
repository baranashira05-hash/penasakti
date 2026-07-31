import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/_next/",
          "/offline",
          "/profil",
          "/bookmark",
          "/reading-list",
          "/tulis-berita/",
          "/*?page=",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/artikel/",
          "/berita/",
          "/kategori/",
          "/tag/",
          "/penulis/",
          "/tentang-kami",
          "/redaksi",
          "/kontak",
          "/sitemap.xml",
          "/news-sitemap.xml",
          "/sitemap-index.xml",
          "/rss.xml",
        ],
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
      {
        userAgent: "Googlebot-News",
        allow: ["/artikel/", "/berita/"],
        disallow: [],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap-index.xml`,
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`,
    ],
    host: BASE_URL,
  };
}
