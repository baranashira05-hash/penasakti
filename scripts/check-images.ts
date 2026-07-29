import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const articles = await prisma.article.findMany({
    take: 10,
    select: { featuredImage: true, title: true },
    where: { featuredImage: { not: null } },
    orderBy: { createdAt: "desc" },
  });

  console.log("=== Sample Featured Images ===\n");
  articles.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title?.substring(0, 50)}`);
    console.log(`   URL: ${a.featuredImage}\n`);
  });

  const total = await prisma.article.count({ where: { featuredImage: { not: null } } });
  console.log(`Total artikel dengan gambar: ${total}`);
}

main()
  .catch(e => console.error("Error:", e.message))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
