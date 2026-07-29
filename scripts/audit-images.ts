import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const total = await prisma.article.count();
  const withImage = await prisma.article.count({ where: { featuredImage: { not: null } } });
  const wpImages = await prisma.article.count({ where: { featuredImage: { contains: "wp-content/uploads" } } });
  const cloudinary = await prisma.article.count({ where: { featuredImage: { contains: "cloudinary" } } });
  const other = withImage - wpImages - cloudinary;
  
  console.log(`Total artikel     : ${total}`);
  console.log(`Punya gambar      : ${withImage}`);
  console.log(`Gambar WordPress  : ${wpImages} ← BROKEN`);
  console.log(`Gambar Cloudinary : ${cloudinary} ← OK`);
  console.log(`Gambar lainnya    : ${other}`);

  // Sample 3 artikel dengan gambar valid
  const valid = await prisma.article.findMany({
    take: 3,
    where: { featuredImage: { not: { contains: "wp-content" } } },
    select: { title: true, featuredImage: true }
  });
  console.log("\nContoh gambar valid:");
  valid.forEach(a => console.log(` - ${a.featuredImage}`));
}

main().finally(async () => { await prisma.$disconnect(); await pool.end(); });
