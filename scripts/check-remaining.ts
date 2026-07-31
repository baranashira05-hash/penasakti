import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const wpContent  = await prisma.article.findMany({
    where: { featuredImage: { contains: "wp-content" } },
    select: { slug: true, featuredImage: true },
  });
  const postimg = await prisma.article.findMany({
    where: { featuredImage: { contains: "postimg" } },
    select: { slug: true, featuredImage: true },
  });
  const cloudinary = await prisma.article.count({ where: { featuredImage: { contains: "cloudinary" } } });

  console.log(`Cloudinary: ${cloudinary}`);
  console.log(`\nwp-content (${wpContent.length}):`);
  wpContent.forEach(a => console.log(`  ${a.slug}: ${a.featuredImage}`));
  console.log(`\npostimg (${postimg.length}):`);
  postimg.forEach(a => console.log(`  ${a.slug}: ${a.featuredImage?.substring(0, 80)}`));
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
