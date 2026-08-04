const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Update semua URL gambar dari penasakti.com/wp-content ke IP hosting lama
  // Karena penasakti.com sekarang = Vercel, tapi file gambar masih di hosting Jagoan
  const OLD_DOMAIN = "https://penasakti.com/wp-content/uploads/";
  const NEW_DOMAIN = "http://103.163.139.88/wp-content/uploads/";

  // Also check for cloudinary URLs in content
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, content: true, featuredImage: true },
  });

  console.log(`Processing ${articles.length} articles...`);

  let updatedFeatured = 0;
  let updatedContent = 0;
  let cloudinaryFound = 0;

  for (const art of articles) {
    let changes = {};

    // Fix featuredImage URL
    if (art.featuredImage && art.featuredImage.includes("penasakti.com/wp-content")) {
      changes.featuredImage = art.featuredImage.replace(
        /https?:\/\/(www\.)?penasakti\.com\/wp-content\/uploads\//g,
        NEW_DOMAIN
      );
      updatedFeatured++;
    }

    // Check if content has cloudinary images
    if (art.content && art.content.includes("cloudinary")) {
      cloudinaryFound++;
      // Extract cloudinary image for featured if no featured yet
      if (!art.featuredImage || art.featuredImage.includes("penasakti.com/wp-content")) {
        const cloudMatch = art.content.match(/https:\/\/res\.cloudinary\.com[^"'\s<>]+/i);
        if (cloudMatch) {
          changes.featuredImage = cloudMatch[0];
          console.log(`  Cloudinary: ${art.slug.substring(0, 40)} → ${cloudMatch[0].substring(0, 60)}`);
        }
      }
    }

    // Fix content URLs (replace penasakti.com/wp-content with hosting IP)
    if (art.content && art.content.includes("penasakti.com/wp-content")) {
      changes.content = art.content.replace(
        /https?:\/\/(www\.)?penasakti\.com\/wp-content\/uploads\//g,
        NEW_DOMAIN
      );
      updatedContent++;
    }

    // Also extract first image from content as featuredImage if still missing
    if (!changes.featuredImage && (!art.featuredImage || art.featuredImage === "")) {
      const imgMatch = (changes.content || art.content).match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1] && imgMatch[1].startsWith("http")) {
        changes.featuredImage = imgMatch[1];
        updatedFeatured++;
      }
    }

    if (Object.keys(changes).length > 0) {
      await prisma.article.update({
        where: { id: art.id },
        data: changes,
      });
    }
  }

  console.log(`\nDone!`);
  console.log(`  Featured images fixed: ${updatedFeatured}`);
  console.log(`  Content URLs fixed: ${updatedContent}`);
  console.log(`  Cloudinary images found: ${cloudinaryFound}`);

  // Sample check
  const sample = await prisma.article.findMany({
    where: { featuredImage: { not: null } },
    select: { slug: true, featuredImage: true },
    take: 5,
    orderBy: { publishedAt: "desc" },
  });
  console.log("\nSample featured images:");
  sample.forEach((a) => console.log(`  ${a.featuredImage?.substring(0, 100)}`));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
