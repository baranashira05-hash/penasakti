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

async function main() {
  // Cek 5 artikel yang sudah "migrasi" (URL cloudinary)
  console.log("=== Artikel dengan URL Cloudinary ===");
  const migrated = await prisma.article.findMany({
    where: { featuredImage: { contains: "cloudinary" } },
    take: 5,
    select: { title: true, featuredImage: true }
  });
  migrated.forEach(a => {
    console.log(`- ${a.title?.substring(0, 50)}`);
    console.log(`  URL: ${a.featuredImage}\n`);
  });

  // Cek 3 artikel yang masih broken
  console.log("=== Artikel masih broken (wp-content) ===");
  const broken = await prisma.article.findMany({
    where: { featuredImage: { contains: "wp-content/uploads" } },
    take: 3,
    select: { title: true, featuredImage: true }
  });
  broken.forEach(a => {
    console.log(`- ${a.featuredImage}`);
  });

  // Test apakah URL cloudinary bisa diakses
  if (migrated.length > 0 && migrated[0].featuredImage) {
    console.log("\n=== Test akses URL Cloudinary ===");
    try {
      const res = await fetch(migrated[0].featuredImage);
      console.log(`Status: ${res.status} ${res.ok ? "✅ OK" : "❌ FAIL"}`);
      console.log(`Content-Type: ${res.headers.get("content-type")}`);
    } catch(e: any) {
      console.log("Error:", e.message);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
