/**
 * Verifikasi og:image flow untuk 10 artikel terbaru
 * Simulates exactly what toOgImageUrl() does di production
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool   = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const SITE_URL = "https://www.penasakti.com";

const SAFE_DOMAINS = [
  "vercel-storage.com",
  "blob.vercel-storage.com",
  "res.cloudinary.com",
  "cloudinary.com",
];

function toOgImageUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const url = rawUrl.startsWith("/") ? `${SITE_URL}${rawUrl}` : rawUrl;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;
    if (pathname.startsWith("/wp-content/")) return null;
    const isSafe = SAFE_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`));
    if (isSafe) return url.replace(/^http:\/\//, "https://");
    if (hostname === "penasakti.com" || hostname === "www.penasakti.com") {
      return url.replace("https://penasakti.com", "https://www.penasakti.com")
                .replace("http://penasakti.com", "https://www.penasakti.com")
                .replace("http://www.penasakti.com", "https://www.penasakti.com");
    }
    if (hostname === "cdn.penasakti.com") return null;
    return `${SITE_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
  } catch { return null; }
}

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", featuredImage: { not: null } },
    select: { slug: true, title: true, featuredImage: true, category: { select: { name: true } }, author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  console.log("=== Verifikasi og:image 10 Artikel Terbaru ===\n");

  let okCount = 0, fallbackCount = 0;

  for (const art of articles) {
    const ogUrl = toOgImageUrl(art.featuredImage)
      ?? `${SITE_URL}/api/og?title=${encodeURIComponent((art.title || "").slice(0, 100))}&category=${encodeURIComponent(art.category?.name || "Berita")}&author=${encodeURIComponent(art.author?.name || "Redaksi")}`;

    const isFoto = ogUrl.includes("cloudinary") || ogUrl.includes("vercel-storage") || ogUrl.includes("proxy-image");
    const isOgGen = ogUrl.includes("/api/og?");
    const status = isFoto ? "✅ FOTO" : isOgGen ? "⚡ OG-GEN" : "❓";

    if (isFoto) okCount++; else fallbackCount++;

    console.log(`${status} | ${art.slug?.substring(0, 55).padEnd(55)}`);
    console.log(`         → ${ogUrl.substring(0, 90)}`);
    console.log();
  }

  console.log(`\n=== RINGKASAN ===`);
  console.log(`✅ Pakai foto asli (Cloudinary/proxy) : ${okCount}`);
  console.log(`⚡ Pakai OG generated (judul artikel)  : ${fallbackCount}`);

  // Cek total DB
  const total     = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const withImg   = await prisma.article.count({ where: { status: "PUBLISHED", featuredImage: { contains: "cloudinary" } } });
  const noImg     = await prisma.article.count({ where: { status: "PUBLISHED", featuredImage: null } });
  const wpBroken  = await prisma.article.count({ where: { featuredImage: { contains: "wp-content" } } });
  console.log(`\n=== STATUS DATABASE ===`);
  console.log(`Total artikel published      : ${total}`);
  console.log(`✅ Foto Cloudinary (MUNCUL)  : ${withImg}`);
  console.log(`⚡ Tanpa foto (OG generated) : ${noImg}`);
  console.log(`❌ wp-content broken         : ${wpBroken}`);
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
