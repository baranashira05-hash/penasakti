/**
 * Upload gambar lokal ke Cloudinary & update database
 * Pengganti upload-local-images.ts karena Vercel Blob store suspended.
 *
 * Fitur:
 * - Skip thumbnail WordPress (nama-WxH.jpg)
 * - Skip gambar yang sudah ada di Cloudinary (idempotent / aman di-rerun)
 * - Sequential per-file agar progress terlihat jelas
 * - Simpan urlMap ke file JSON agar DB bisa di-update ulang jika perlu
 * - Update featuredImage di DB setelah semua upload selesai
 */
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool   = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const UPLOADS_FOLDER    = "F:\\penasakti baru\\2026\\2026";
const URL_MAP_FILE      = "scripts/cloudinary-url-map.json";
const IMAGE_EXT         = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const THUMBNAIL_PATTERN = /-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i;

function scanOriginalImages(dir: string): string[] {
  const files: string[] = [];
  function scan(d: string) {
    try {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) { scan(full); continue; }
        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXT.includes(ext)) continue;
        if (THUMBNAIL_PATTERN.test(entry.name)) continue;
        files.push(full);
      }
    } catch {}
  }
  scan(dir);
  return files;
}

async function main() {
  console.log("\n🚀 Upload gambar lokal → Cloudinary\n");

  // Ping Cloudinary
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary terhubung\n");
  } catch (e: any) {
    console.error("❌ Cloudinary gagal:", e.message);
    process.exit(1);
  }

  const allImages = scanOriginalImages(UPLOADS_FOLDER);
  console.log(`📂 Folder : ${UPLOADS_FOLDER}`);
  console.log(`📸 Total file asli: ${allImages.length}\n`);

  // Load existing urlMap jika ada (resume support)
  const urlMap: Record<string, string> = fs.existsSync(URL_MAP_FILE)
    ? JSON.parse(fs.readFileSync(URL_MAP_FILE, "utf-8"))
    : {};

  const already = Object.keys(urlMap).length;
  if (already > 0) console.log(`♻️  Resume: ${already} file sudah di-map sebelumnya\n`);

  let uploaded = 0;
  let skipped  = 0;
  let failed   = 0;

  for (let i = 0; i < allImages.length; i++) {
    const filePath = allImages[i];
    const filename = path.basename(filePath);
    const key      = filename.toLowerCase();
    const month    = path.basename(path.dirname(filePath)); // "01","02",...
    const publicId = `penasakti/wp-migration/2026/${month}/${path.parse(filename).name}`;
    const num      = `[${i + 1}/${allImages.length}]`;

    // Sudah ada di map → skip upload
    if (urlMap[key]) {
      skipped++;
      if (i % 50 === 0) console.log(`${num} ♻️  (sudah ada) ${filename}`);
      continue;
    }

    process.stdout.write(`${num} ${filename.substring(0, 55).padEnd(57)}`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id:     publicId,
        overwrite:     false,
        resource_type: "image",
        quality:       "auto",
        fetch_format:  "auto",
      });
      urlMap[key] = result.secure_url;
      uploaded++;
      console.log(`✅`);
    } catch (e: any) {
      // Already exists (409) → get existing URL
      if (e?.http_code === 400 || e?.message?.includes("already exists")) {
        try {
          const info = await cloudinary.api.resource(publicId);
          urlMap[key] = info.secure_url;
          skipped++;
          console.log(`♻️  (sudah ada)`);
        } catch {
          failed++;
          console.log(`❌ ${e.message?.substring(0, 50)}`);
        }
      } else {
        failed++;
        console.log(`❌ ${e.message?.substring(0, 60)}`);
      }
    }

    // Simpan map setiap 25 file agar bisa resume jika crash
    if ((uploaded + skipped) % 25 === 0) {
      fs.writeFileSync(URL_MAP_FILE, JSON.stringify(urlMap, null, 2));
    }
  }

  // Simpan map final
  fs.writeFileSync(URL_MAP_FILE, JSON.stringify(urlMap, null, 2));
  console.log(`\n✅ Upload baru: ${uploaded}  ♻️  Skip: ${skipped}  ❌ Gagal: ${failed}`);
  console.log(`💾 URL map disimpan ke ${URL_MAP_FILE}\n`);

  // ─── Update database ────────────────────────────────────────────────────────
  console.log("📝 Update URL di database...");

  const articles = await prisma.article.findMany({
    where: { featuredImage: { contains: "wp-content/uploads/2026" } },
    select: { id: true, featuredImage: true },
  });
  console.log(`📰 Artikel dengan gambar wp-content: ${articles.length}`);

  let dbUpdated  = 0;
  let dbNotFound = 0;

  for (const article of articles) {
    if (!article.featuredImage) continue;
    const parts  = article.featuredImage.split("/");
    const fname  = parts[parts.length - 1].toLowerCase();
    const newUrl = urlMap[fname];
    if (newUrl) {
      await prisma.article.update({
        where: { id: article.id },
        data:  { featuredImage: newUrl },
      });
      dbUpdated++;
    } else {
      dbNotFound++;
      console.warn(`  ⚠️  Tidak ada mapping: ${fname}`);
    }
  }

  console.log("\n=== HASIL AKHIR ===");
  console.log(`✅ Gambar diupload      : ${uploaded}`);
  console.log(`♻️  Gambar sudah ada    : ${skipped}`);
  console.log(`❌ Gagal upload         : ${failed}`);
  console.log(`✅ Artikel DB diupdate  : ${dbUpdated}`);
  console.log(`⚠️  Tidak ada di map    : ${dbNotFound}`);
  console.log("\n🎉 Selesai! Thumbnail artikel sekarang pakai Cloudinary.");
}

main()
  .catch(e => { console.error("Fatal:", e); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
