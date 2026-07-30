import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const total = await prisma.article.count();
  const broken = await prisma.article.count({ where: { featuredImage: { contains: "wp-content/uploads" } } });
  const cloudinary = await prisma.article.count({ where: { featuredImage: { contains: "cloudinary" } } });
  const noImage = await prisma.article.count({ where: { featuredImage: null } });
  const other = total - broken - cloudinary - noImage;

  console.log("=== STATUS DATABASE ===");
  console.log(`Total artikel         : ${total}`);
  console.log(`Gambar Cloudinary ✅  : ${cloudinary}`);
  console.log(`Gambar WP (broken) ❌ : ${broken}`);
  console.log(`Tanpa gambar          : ${noImage}`);
  console.log(`URL lain              : ${other}`);
  
  console.log("\n=== 5 ARTIKEL TERBARU (PUBLISHED) ===");
  const latest = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: { title: true, featuredImage: true, publishedAt: true }
  });
  latest.forEach((a, i) => {
    const imgStatus = !a.featuredImage ? "❌ no image" 
      : a.featuredImage.includes("cloudinary") ? "✅ cloudinary"
      : a.featuredImage.includes("wp-content") ? "⚠️  WP broken"
      : "🔵 other";
    console.log(`${i+1}. [${imgStatus}] ${a.title?.substring(0, 50)}`);
    if (a.featuredImage) console.log(`   ${a.featuredImage.substring(0, 80)}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
