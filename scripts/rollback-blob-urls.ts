/**
 * Rollback URL blob yang suspended kembali ke URL WP asli
 * berdasarkan nama file yang tersimpan di path blob
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // Ambil semua artikel yang URL-nya pakai blob vercel (yang suspended)
  const articles = await prisma.article.findMany({
    where: { featuredImage: { contains: "0grjdehvff93pivc.public.blob.vercel-storage.com/wp-migration" } },
    select: { id: true, featuredImage: true },
  });

  console.log(`Artikel dengan URL blob suspended: ${articles.length}`);

  let updated = 0;
  for (const article of articles) {
    if (!article.featuredImage) continue;
    
    // Ekstrak nama file dari blob URL
    // https://0grjdehvff93pivc.public.blob.vercel-storage.com/wp-migration/2026/07/IMG-xxx.jpg
    const parts = article.featuredImage.split("/");
    const filename = parts[parts.length - 1];
    const month = parts[parts.length - 2]; // 01, 02, ..., 07
    const year = parts[parts.length - 3]; // 2026
    
    // Reconstruct WP URL
    const wpUrl = `https://penasakti.com/wp-content/uploads/${year}/${month}/${filename}`;
    
    await prisma.article.update({
      where: { id: article.id },
      data: { featuredImage: wpUrl },
    });
    updated++;
  }

  console.log(`✅ Rollback selesai: ${updated} artikel dikembalikan ke URL WP`);
  console.log(`\nSetelah Vercel Blob aktif kembali, jalankan upload-local-images.ts lagi`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
