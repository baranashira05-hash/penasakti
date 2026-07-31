/**
 * Fix sisa gambar yang belum di-migrate ke Cloudinary:
 * 1. wp-content → cari filename di urlMap, update DB
 * 2. postimg.cc → sudah di-proxy by site-url.ts, tapi coba upload ke Cloudinary juga
 */
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool   = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const URL_MAP_FILE = "scripts/cloudinary-url-map.json";

async function main() {
  // Load URL map dari upload sebelumnya
  const urlMap: Record<string, string> = fs.existsSync(URL_MAP_FILE)
    ? JSON.parse(fs.readFileSync(URL_MAP_FILE, "utf-8"))
    : {};
  console.log(`📦 URL map: ${Object.keys(urlMap).length} entri\n`);

  // ── 1. Fix wp-content ──────────────────────────────────────────────────────
  const wpArticles = await prisma.article.findMany({
    where: { featuredImage: { contains: "wp-content" } },
    select: { id: true, slug: true, featuredImage: true },
  });
  console.log(`🔧 Artikel wp-content: ${wpArticles.length}`);

  for (const art of wpArticles) {
    const fname = art.featuredImage!.split("/").pop()!.toLowerCase();
    const newUrl = urlMap[fname];
    if (newUrl) {
      await prisma.article.update({ where: { id: art.id }, data: { featuredImage: newUrl } });
      console.log(`  ✅ Fixed wp-content: ${art.slug} → ${newUrl.substring(0, 70)}`);
    } else {
      console.log(`  ⚠️  Tidak ada mapping untuk: ${fname} (artikel: ${art.slug})`);
    }
  }

  // ── 2. Fix postimg.cc → upload ke Cloudinary ──────────────────────────────
  const postimgArticles = await prisma.article.findMany({
    where: { featuredImage: { contains: "postimg" } },
    select: { id: true, slug: true, featuredImage: true },
  });
  console.log(`\n🔧 Artikel postimg.cc: ${postimgArticles.length}`);

  for (const art of postimgArticles) {
    const rawUrl = art.featuredImage!;
    // Ekstrak nama file dari URL postimg
    const fname = rawUrl.split("/").pop()?.split("?")[0] || "";
    const nameNoExt = fname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const publicId = `penasakti/postimg-migration/${nameNoExt}`;

    console.log(`  📥 ${art.slug}: ${rawUrl.substring(0, 70)}`);

    try {
      // Upload dari URL langsung (Cloudinary fetch)
      const result = await cloudinary.uploader.upload(rawUrl, {
        public_id:     publicId,
        overwrite:     false,
        resource_type: "image",
        quality:       "auto",
        fetch_format:  "auto",
      });
      await prisma.article.update({
        where: { id: art.id },
        data:  { featuredImage: result.secure_url },
      });
      console.log(`  ✅ Uploaded → ${result.secure_url.substring(0, 70)}`);
    } catch (e: any) {
      if (e?.http_code === 400 || e?.message?.includes("already exists")) {
        try {
          const info = await cloudinary.api.resource(publicId);
          await prisma.article.update({
            where: { id: art.id },
            data:  { featuredImage: info.secure_url },
          });
          console.log(`  ♻️  Already exists → ${info.secure_url.substring(0, 70)}`);
        } catch {
          console.log(`  ⚠️  Tetap pakai postimg (akan di-proxy): ${rawUrl.substring(0, 70)}`);
        }
      } else {
        console.log(`  ⚠️  Gagal upload, tetap pakai postimg: ${e.message?.substring(0, 60)}`);
      }
    }
  }

  console.log("\n✅ Selesai!");
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
