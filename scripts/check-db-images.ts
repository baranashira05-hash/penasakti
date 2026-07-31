import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const total      = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const withImg    = await prisma.article.count({ where: { status: "PUBLISHED", featuredImage: { not: null } } });
  const wpContent  = await prisma.article.count({ where: { featuredImage: { contains: "wp-content" } } });
  const cloudinary = await prisma.article.count({ where: { featuredImage: { contains: "cloudinary" } } });
  const blobVercel = await prisma.article.count({ where: { featuredImage: { contains: "vercel-storage" } } });
  const postimg    = await prisma.article.count({ where: { featuredImage: { contains: "postimg" } } });
  const noImg      = await prisma.article.count({ where: { status: "PUBLISHED", featuredImage: null } });

  console.log("=== Status Gambar Artikel di DB ===");
  console.log(`Total artikel published  : ${total}`);
  console.log(`Punya featuredImage      : ${withImg}`);
  console.log(`  - Cloudinary           : ${cloudinary}`);
  console.log(`  - Vercel Blob          : ${blobVercel}`);
  console.log(`  - wp-content (broken)  : ${wpContent}`);
  console.log(`  - postimg.cc           : ${postimg}`);
  console.log(`Tidak punya gambar (null): ${noImg}`);

  const samples = await prisma.article.findMany({
    where: { status: "PUBLISHED", featuredImage: { not: null } },
    select: { title: true, featuredImage: true },
    take: 5,
    orderBy: { publishedAt: "desc" },
  });
  console.log("\nSample 5 artikel terbaru dengan gambar:");
  samples.forEach(a => console.log(" -", a.featuredImage?.substring(0, 90)));
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
