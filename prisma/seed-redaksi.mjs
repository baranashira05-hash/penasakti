// Seed redaksi members — jalankan: node prisma/seed-redaksi.mjs
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding redaksi members...");

  // Hapus data lama
  await prisma.redaksiMember.deleteMany();

  const members = await prisma.redaksiMember.createMany({
    data: [
      {
        name: "Ugastra, MB, SH",
        jabatan: "Pemimpin Redaksi",
        group: "PIMPINAN",
        email: "redaksi@penasakti.com",
        order: 1,
      },
      {
        name: "Agus Yulianto",
        jabatan: "Editor Kontributor",
        group: "EDITOR",
        order: 1,
      },
    ],
  });

  console.log(`✅ Seeded ${members.count} redaksi members`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
