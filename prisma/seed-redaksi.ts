/**
 * Seed data awal untuk tabel redaksi_members
 * Jalankan: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-redaksi.ts
 * Atau tambahkan ke prisma/seed.ts yang sudah ada
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding redaksi members...");

  // Hapus data lama (opsional, hapus baris ini jika tidak ingin overwrite)
  await prisma.redaksiMember.deleteMany();

  const members = await prisma.redaksiMember.createMany({
    data: [
      // Pimpinan
      {
        name: "Ugastra, MB, SH",
        jabatan: "Pemimpin Redaksi",
        group: "PIMPINAN",
        email: "redaksi@penasakti.com",
        order: 1,
      },
      // Editor
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
