/**
 * Diagnosa mengapa artikel tertentu tidak punya thumbnail saat share
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool   = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const total = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const withImg = await prisma.article.count({
    where: { status: "PUBLISHED", featuredImage: { not: null } }
  });
  const nullImg = await prisma.article.count({
    where: { status: "PUBLISHED", featuredImage: null }
  });
  const emptyImg = await prisma.article.count({
    where: { status: "PUBLISHED", featuredImage: "" }
  });
  const cloudinary = await prisma.article.count({
    where: { featuredImage: { contains: "cloudinary" } }
  });

  console.log("=== Status Gambar DB ===");
  console.log(`Total published       : ${total}`);
  console.log(`Punya gambar (not null): ${withImg}`);
  console.log(`  - Cloudinary        : ${cloudinary}`);
  console.log(`Tidak punya (null)    : ${nullImg}`);
  console.log(`String kosong ""      : ${emptyImg}`);

  // Cek artikel "aspirasi tersumbat"
  const target = await prisma.article.findFirst({
    where: { slug: { contains: "aspirasi-tersumbat" } },
    select: { slug: true, title: true, featuredImage: true, ogImage: true },
  });
  console.log("\n=== Artikel 'aspirasi-tersumbat' ===");
  if (target) {
    console.log("title        :", target.title?.substring(0, 60));
    console.log("featuredImage:", target.featuredImage || "NULL/EMPTY");
    console.log("ogImage      :", target.ogImage || "NULL/EMPTY");
  } else {
    console.log("Tidak ditemukan!");
  }

  // Ambil 20 artikel terbaru yang featuredImage null
  const nullArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED", OR: [{ featuredImage: null }, { featuredImage: "" }] },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: { slug: true, title: true, publishedAt: true },
  });
  console.log(`\n=== 20 Artikel Terbaru TANPA gambar (${nullImg} total) ===`);
  nullArticles.forEach((a, i) => {
    const d = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : "-";
    console.log(`${i+1}. [${d}] ${a.title?.substring(0, 60)}`);
    console.log(`   /artikel/${a.slug}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
