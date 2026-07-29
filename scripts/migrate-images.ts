/**
 * Script migrasi gambar dari WordPress ke Cloudinary
 * Mendownload gambar dari WP API dan mengupload ke Cloudinary
 * lalu update URL di database
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cek apakah Cloudinary sudah dikonfigurasi
async function checkCloudinary() {
  try {
    await cloudinary.api.ping();
    return true;
  } catch (e: any) {
    console.error("❌ Cloudinary tidak bisa diakses:", e.message);
    return false;
  }
}

// Upload URL gambar ke Cloudinary
async function uploadToCloudinary(imageUrl: string, publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: "penasakti/articles",
      resource_type: "image",
      overwrite: false,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    return result.secure_url;
  } catch (e: any) {
    // Kalau sudah ada, ambil URL yang existing
    if (e.http_code === 409 || e.message?.includes("already exists")) {
      try {
        const existing = await cloudinary.api.resource(`penasakti/articles/${publicId}`);
        return existing.secure_url;
      } catch {}
    }
    return null;
  }
}

async function main() {
  console.log("🚀 Mulai migrasi gambar WordPress → Cloudinary\n");

  // Cek Cloudinary
  const cloudOk = await checkCloudinary();
  if (!cloudOk) {
    console.log("\n⚠️  Cloudinary belum terkonfigurasi.");
    console.log("Tambahkan ke .env:");
    console.log("  CLOUDINARY_CLOUD_NAME=...");
    console.log("  CLOUDINARY_API_KEY=...");
    console.log("  CLOUDINARY_API_SECRET=...");
    return;
  }
  console.log("✅ Cloudinary OK\n");

  // Ambil artikel dengan gambar WordPress yang perlu dimigrasi
  const articles = await prisma.article.findMany({
    where: {
      featuredImage: { contains: "wp-content/uploads" }
    },
    select: { id: true, slug: true, featuredImage: true },
    orderBy: { publishedAt: "desc" },
  });

  console.log(`📦 Total artikel dengan gambar WP: ${articles.length}\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (!article.featuredImage) continue;

    process.stdout.write(`[${i + 1}/${articles.length}] ${article.slug?.substring(0, 40)}... `);

    // Generate publicId dari slug
    const publicId = article.slug?.replace(/[^a-z0-9-]/g, "-").substring(0, 60) || article.id;

    // Coba upload dari URL WordPress lama
    // Karena domain sudah ke Vercel, kita coba dari Wayback Machine sebagai fallback
    const wpUrl = article.featuredImage;
    
    // Coba upload langsung ke Cloudinary menggunakan fetch URL
    const cloudUrl = await uploadToCloudinary(wpUrl, publicId);

    if (cloudUrl) {
      await prisma.article.update({
        where: { id: article.id },
        data: { featuredImage: cloudUrl },
      });
      success++;
      console.log(`✅ OK`);
    } else {
      failed++;
      console.log(`❌ Gagal`);
    }

    // Delay kecil untuk hindari rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n✅ Berhasil: ${success}`);
  console.log(`❌ Gagal   : ${failed}`);
  console.log(`⏭️  Lewati  : ${skipped}`);
}

main()
  .catch(e => console.error("Error:", e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
