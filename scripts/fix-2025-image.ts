/**
 * Fix 1 artikel yang gambarnya dari wp-content/uploads/2025
 * Coba upload ke Cloudinary langsung dari URL (server WP mungkin masih bisa diakses)
 */
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool   = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const article = await prisma.article.findFirst({
    where: { slug: "festival-7-sungai-diselenggarakan-pemdes-cibuluh-kecamatan-tanjung-siang-bersama-dinas-pariwisata-dan-dinas-perikanan-subang" },
    select: { id: true, featuredImage: true, title: true },
  });

  if (!article) { console.log("Artikel tidak ditemukan"); return; }
  console.log("Artikel:", article.title?.substring(0, 60));
  console.log("Gambar :", article.featuredImage);

  const imgUrl = article.featuredImage!;

  // Coba upload langsung dari URL penasakti.com (mungkin masih bisa diakses)
  console.log("\n📥 Mencoba upload dari URL...");
  try {
    const result = await cloudinary.uploader.upload(imgUrl, {
      public_id:     "penasakti/wp-migration/2025/07/Screenshot_20250727-113228",
      overwrite:     false,
      resource_type: "image",
    });
    await prisma.article.update({
      where: { id: article.id },
      data:  { featuredImage: result.secure_url },
    });
    console.log("✅ Berhasil!", result.secure_url);
    return;
  } catch (e: any) {
    console.log("❌ Gagal dari URL:", e.message?.substring(0, 80));
  }

  // Coba via IP langsung
  const ipUrl = imgUrl.replace("https://penasakti.com", "http://101.50.1.121");
  console.log("\n📥 Mencoba upload via IP (101.50.1.121)...");
  try {
    const result = await cloudinary.uploader.upload(ipUrl, {
      public_id:     "penasakti/wp-migration/2025/07/Screenshot_20250727-113228",
      overwrite:     false,
      resource_type: "image",
      headers:       { "Host": "penasakti.com" },
    });
    await prisma.article.update({
      where: { id: article.id },
      data:  { featuredImage: result.secure_url },
    });
    console.log("✅ Berhasil via IP!", result.secure_url);
    return;
  } catch (e: any) {
    console.log("❌ Gagal via IP:", e.message?.substring(0, 80));
  }

  // Fallback: set featuredImage null → akan pakai /api/og sebagai OG image
  console.log("\n⚠️  Gambar tidak bisa diakses. Set featuredImage = null");
  console.log("   → Artikel akan pakai OG image generated (judul + kategori)");
  await prisma.article.update({
    where: { id: article.id },
    data:  { featuredImage: null },
  });
  console.log("✅ featuredImage di-set null");
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
