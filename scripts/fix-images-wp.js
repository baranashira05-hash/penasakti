const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Ambil semua artikel yang belum punya featuredImage
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { featuredImage: null },
        { featuredImage: "" },
      ],
    },
    select: { id: true, slug: true, content: true },
  });

  console.log(`Found ${articles.length} articles without featured image`);

  let updated = 0;
  for (const art of articles) {
    // Cari gambar pertama di content HTML
    const imgMatch = art.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      let imgUrl = imgMatch[1];

      // Jika URL relatif, skip
      if (!imgUrl.startsWith("http")) continue;

      // Jika URL dari cloudinary, gunakan langsung
      // Jika dari domain lain, tetap gunakan (Next.js akan handle via remotePatterns)
      await prisma.article.update({
        where: { id: art.id },
        data: { featuredImage: imgUrl },
      });
      updated++;
    }
  }

  console.log(`Updated ${updated} articles with images from content`);

  // Tampilkan sample URL gambar yang ditemukan
  const sample = await prisma.article.findMany({
    where: { featuredImage: { not: null } },
    select: { slug: true, featuredImage: true },
    take: 10,
    orderBy: { publishedAt: "desc" },
  });
  console.log("\nSample images found:");
  sample.forEach((a) => console.log(`  ${a.slug.substring(0, 40)} → ${a.featuredImage?.substring(0, 80)}`));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
