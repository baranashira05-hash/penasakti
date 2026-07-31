import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

// Sitemap di-generate secara dynamic dan di-cache 1 jam
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Halaman statis ────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              lastModified: now, changeFrequency: "hourly",  priority: 1.0 },
    { url: `${BASE_URL}/live`,                    lastModified: now, changeFrequency: "always",  priority: 0.9 },
    { url: `${BASE_URL}/video`,                   lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/foto`,                    lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE_URL}/infografis`,              lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE_URL}/pencarian`,               lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/store`,                   lastModified: now, changeFrequency: "daily",   priority: 0.6 },
    { url: `${BASE_URL}/podcast`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/redaksi`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tentang-kami`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/kontak`,                  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/kode-etik`,               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/pedoman-media-siber`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,              lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Artikel dari database ─────────────────────────────────────────
  // Dibatasi 45.000 agar 1 sitemap tetap di bawah limit Google (50.000 URL / 50 MB)
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        isFeatured: true,
        isBreaking: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 45000,
    });

    articlePages = articles.map((article) => ({
      url: `${BASE_URL}/artikel/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: article.isBreaking ? 0.95 : article.isFeatured ? 0.9 : 0.8,
    }));
  } catch {}

  // ── Halaman kategori ─────────────────────────────────────────────
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    });
    categoryPages = categories.map((cat) => ({
      url: `${BASE_URL}/kategori/${cat.slug}`,
      lastModified: cat.updatedAt ?? now,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    }));
  } catch {}

  // ── Halaman tag (top-1000 berdasarkan jumlah artikel) ────────────
  let tagPages: MetadataRoute.Sitemap = [];
  try {
    const tags = await prisma.tag.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { articles: { _count: "desc" } },
      take: 1000,
    });
    tagPages = tags.map((tag) => ({
      url: `${BASE_URL}/tag/${tag.slug}`,
      lastModified: tag.updatedAt ?? now,
      changeFrequency: "daily" as const,
      priority: 0.5,
    }));
  } catch {}

  // ── Halaman penulis ───────────────────────────────────────────────
  let authorPages: MetadataRoute.Sitemap = [];
  try {
    const authors = await prisma.authorProfile.findMany({
      select: { slug: true, updatedAt: true },
    });
    authorPages = authors.map((a) => ({
      url: `${BASE_URL}/penulis/${a.slug}`,
      lastModified: a.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [
    ...staticPages,
    ...categoryPages,
    ...authorPages,
    ...articlePages,
    ...tagPages,
  ];
}
