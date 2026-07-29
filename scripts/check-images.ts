import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Cek 5 artikel pertama dengan gambar:\n");
  
  const articles = await prisma.article.findMany({ 
    take: 5, 
    select: { 
      featuredImage: true, 
      title: true 
    }, 
    where: { 
      featuredImage: { not: null } 
    } 
  });
  
  articles.forEach(a => {
    console.log(`Title: ${a.title?.substring(0, 50)}`);
    console.log(`Image: ${a.featuredImage}\n`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => { 
    await prisma.$disconnect(); 
    await pool.end(); 
  });
