/**
 * Upload gambar lokal ke Vercel Blob & update database
 * Hanya upload file ASLI (bukan thumbnail resize WordPress)
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { put } from "@vercel/blob";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const UPLOADS_FOLDER = "F:\\penasakti baru\\2026\\2026";
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// Pola thumbnail WordPress: nama-WxH.jpg — skip ini
const THUMBNAIL_PATTERN = /-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i;

function getContentType(ext: string): string {
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function scanOriginalImages(dir: string): Promise<string[]> {
  const files: string[] = [];
  function scan(d: string) {
    try {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) { scan(full); continue; }
        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXT.includes(ext)) continue;
        if (THUMBNAIL_PATTERN.test(entry.name)) continue; // skip thumbnail
        files.push(full);
      }
    } catch {}
  }
  scan(dir);
  return files;
}

async function main() {
  console.log(`\n🚀 Upload gambar ke Vercel Blob\n`);
  console.log(`📂 Folder: ${UPLOADS_FOLDER}`);

  const allImages = await scanOriginalImages(UPLOADS_FOLDER);
  console.log(`📸 File asli (non-thumbnail): ${allImages.length}\n`);

  // Map: namafile.toLowerCase() → blob URL (setelah upload)
  const urlMap = new Map<string, string>();
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < allImages.length; i++) {
    const filePath = allImages[i];
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    const month = path.basename(path.dirname(filePath)); // 01, 02, dst
    const blobPath = `wp-migration/2026/${month}/${filename}`;

    process.stdout.write(`[${i + 1}/${allImages.length}] ${filename.substring(0, 50)}... `);

    try {
      const buffer = fs.readFileSync(filePath);
      const blob = await put(blobPath, buffer, {
        access: "public",
        contentType: getContentType(ext),
        addRandomSuffix: false,
      });
      urlMap.set(filename.toLowerCase(), blob.url);
      uploaded++;
      console.log(`✅`);
    } catch (e: any) {
      // Kalau sudah ada (conflict), construct URL manual
      if (e.message?.includes("already exists") || e.status === 409) {
        const baseUrl = `https://0grjdehvff93pivc.public.blob.vercel-storage.com/wp-migration/2026/${month}/${filename}`;
        urlMap.set(filename.toLowerCase(), baseUrl);
        uploaded++;
        console.log(`♻️  (sudah ada)`);
      } else {
        failed++;
        console.log(`❌ ${e.message?.substring(0, 50)}`);
      }
    }
  }

  console.log(`\n✅ Upload: ${uploaded}  ❌ Gagal: ${failed}`);

  // Update database
  console.log(`\n📝 Update URL di database...`);
  const articles = await prisma.article.findMany({
    where: { featuredImage: { contains: "wp-content/uploads/2026" } },
    select: { id: true, featuredImage: true },
  });
  console.log(`📰 Artikel 2026 dengan gambar broken: ${articles.length}`);

  let updated = 0;
  let notFound = 0;

  for (const article of articles) {
    if (!article.featuredImage) continue;
    const parts = article.featuredImage.split("/");
    const filename = parts[parts.length - 1].toLowerCase();
    const blobUrl = urlMap.get(filename);
    if (blobUrl) {
      await prisma.article.update({ where: { id: article.id }, data: { featuredImage: blobUrl } });
      updated++;
    } else {
      notFound++;
    }
  }

  console.log(`\n=== HASIL AKHIR ===`);
  console.log(`✅ Gambar diupload  : ${uploaded}`);
  console.log(`✅ Artikel diupdate : ${updated}`);
  console.log(`⚠️  Tidak ditemukan : ${notFound}`);
  console.log(`\n🎉 Selesai! Refresh penasakti.com untuk melihat hasilnya.`);
}

main()
  .catch(e => console.error("Error:", e.message))
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
