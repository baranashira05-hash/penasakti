import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool   = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // 5 artikel terbaru yang masuk hero slider
  const arts = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: { id: true, title: true, featuredImage: true, slug: true },
  });

  console.log("=== 5 Artikel Terbaru (masuk hero) ===\n");
  for (const a of arts) {
    console.log(`Judul : ${a.title?.substring(0, 60)}`);
    console.log(`URL   : ${a.featuredImage || "NULL"}`);
    console.log(`Valid?: ${a.featuredImage ? (a.featuredImage.startsWith("https://") ? "✅" : "❌") : "❌ NULL"}`);
    console.log();
  }

  // Cek ada tidak URL yang terpotong / malformed
  const malformed = await prisma.article.findMany({
    where: {
      AND: [
        { featuredImage: { not: null } },
        { featuredImage: { not: { startsWith: "https://" } } },
        { featuredImage: { not: { startsWith: "http://" } } },
        { featuredImage: { not: { startsWith: "/" } } },
      ]
    },
    select: { slug: true, featuredImage: true },
    take: 10,
  });
  if (malformed.length > 0) {
    console.log(`\n⚠️  URL MALFORMED (${malformed.length}):`);
    malformed.forEach(a => console.log(`  ${a.slug}: ${a.featuredImage}`));
  } else {
    console.log("✅ Tidak ada URL malformed");
  }
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
