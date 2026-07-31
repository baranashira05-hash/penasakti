import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// robots.txt selalu menggunakan domain canonical https://penasakti.com
const BASE_URL = SITE_URL;

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
