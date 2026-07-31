/**
 * ============================================================
 * CLEANUP VERCEL BLOB - Hapus semua file dari Vercel Blob
 * ============================================================
 * Jalankan ini SETELAH semua gambar berhasil pindah ke Cloudinary
 *
 * Cara pakai:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/cleanup-vercel-blob.ts
 *
 * Mode:
 *   --check   → hanya tampilkan daftar blob, tidak hapus
 *   --confirm → hapus semua blob (perlu flag ini untuk benar-benar hapus)
 * ============================================================
 */

import { list, del } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes("--check") || !args.includes("--confirm");
const PREFIX = "wp-migration/"; // hanya hapus folder migrasi WP

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   CLEANUP VERCEL BLOB                            ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  if (CHECK_ONLY) {
    console.log("📋 MODE CHECK - tidak ada yang dihapus");
    console.log("   Tambahkan --confirm untuk benar-benar hapus\n");
  } else {
    console.log("⚠️  MODE HAPUS - semua blob WP migration akan dihapus!\n");
  }

  // Cek dulu apakah masih ada artikel dengan URL blob di database
  const blobArticles = await prisma.article.count({
    where: { featuredImage: { contains: "vercel-storage.com" } },
  });

  if (blobArticles > 0) {
    console.log(`⚠️  PERHATIAN: Masih ada ${blobArticles} artikel dengan URL Vercel Blob!`);
    console.log("   Jalankan wp-reimport.ts --only-img dulu untuk pindah ke Cloudinary\n");
    if (!CHECK_ONLY) {
      console.log("❌ Batal. Pastikan semua gambar sudah di Cloudinary sebelum hapus blob.");
      return;
    }
  } else {
    console.log("✅ Tidak ada artikel yang pakai URL Vercel Blob - aman untuk hapus\n");
  }

  // List semua blob
  console.log(`📂 Mengambil daftar blob (prefix: ${PREFIX})...`);
  
  let cursor: string | undefined;
  let totalFiles = 0;
  let totalSize = 0;
  const urlsToDelete: string[] = [];

  do {
    const result = await list({
      prefix: PREFIX,
      cursor,
      limit: 1000,
    });

    for (const blob of result.blobs) {
      totalFiles++;
      totalSize += blob.size;
      urlsToDelete.push(blob.url);
      if (CHECK_ONLY && totalFiles <= 20) {
        console.log(`  ${blob.pathname} (${(blob.size / 1024).toFixed(1)} KB)`);
      }
    }

    cursor = result.cursor;
  } while (cursor);

  console.log(`\n📊 Total file  : ${totalFiles}`);
  console.log(`💾 Total ukuran: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  if (CHECK_ONLY) {
    console.log("\n💡 Jalankan dengan --confirm untuk hapus semua file di atas");
    return;
  }

  if (totalFiles === 0) {
    console.log("\n✅ Tidak ada blob untuk dihapus");
    return;
  }

  // Hapus dalam batch
  console.log(`\n🗑️  Menghapus ${totalFiles} file...`);
  const BATCH = 100;
  let deleted = 0;
  let failed = 0;

  for (let i = 0; i < urlsToDelete.length; i += BATCH) {
    const batch = urlsToDelete.slice(i, i + BATCH);
    try {
      await del(batch);
      deleted += batch.length;
      process.stdout.write(`\r   Dihapus: ${deleted}/${totalFiles}`);
    } catch (e: any) {
      failed += batch.length;
      console.error(`\n   ❌ Batch gagal: ${e.message}`);
    }
  }

  console.log(`\n\n✅ Berhasil dihapus: ${deleted}`);
  if (failed > 0) console.log(`❌ Gagal: ${failed}`);

  // Status akhir database
  const blobLeft = await prisma.article.count({
    where: { featuredImage: { contains: "vercel-storage.com" } },
  });
  const cloudinary = await prisma.article.count({
    where: { featuredImage: { contains: "cloudinary" } },
  });
  const total = await prisma.article.count();

  console.log("\n=== STATUS AKHIR DATABASE ===");
  console.log(`📰 Total artikel      : ${total}`);
  console.log(`✅ Gambar Cloudinary  : ${cloudinary}`);
  console.log(`⚠️  Masih pakai Blob  : ${blobLeft}`);

  if (blobLeft === 0 && deleted > 0) {
    console.log("\n🎉 Selesai! Vercel Blob sudah bersih.");
    console.log("   Kamu bisa nonaktifkan Vercel Blob dari dashboard Vercel jika mau.");
  }
}

main()
  .catch(e => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
