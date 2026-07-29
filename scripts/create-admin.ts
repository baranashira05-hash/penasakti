import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

const url = process.env.DATABASE_URL || process.env.DIRECT_URL || "";

if (!url) {
  console.error("❌ DATABASE_URL tidak ditemukan di .env!");
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  const email = "admin@penasakti.com";
  const password = "Admin@Penasakti2025!";
  const name = "Super Admin";

  console.log("🔐 Membuat akun Super Admin...\n");

  const existing = await prisma.user.findUnique({ where: { email } });

  const hashedPassword = await bcrypt.hash(password, 12);

  if (existing) {
    console.log(`⚠️  Email ${email} sudah ada, mereset password...\n`);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
        isBanned: false,
      },
    });
    console.log("✅ Password berhasil direset!\n");
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "SUPER_ADMIN",
        isActive: true,
        isBanned: false,
      },
    });
    console.log("✅ Akun Super Admin berhasil dibuat!\n");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 KREDENSIAL LOGIN DASHBOARD:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   🌐 URL      : https://penasakti.com/login`);
  console.log(`   📧 Email    : ${email}`);
  console.log(`   🔑 Password : ${password}`);
  console.log(`   👑 Role     : SUPER_ADMIN`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n⚠️  PENTING: Segera ganti password setelah login pertama!\n");
}

createAdmin()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
