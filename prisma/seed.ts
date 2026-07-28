import { PrismaClient, Role, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database PenaSakti...");

  // ===== CATEGORIES =====
  const categories = [
    { name: "Nasional", slug: "nasional", color: "#e74c3c", icon: "🏛️", order: 1 },
    { name: "Politik", slug: "politik", color: "#8e44ad", icon: "⚖️", order: 2 },
    { name: "Ekonomi", slug: "ekonomi", color: "#27ae60", icon: "📊", order: 3 },
    { name: "Internasional", slug: "internasional", color: "#2980b9", icon: "🌍", order: 4 },
    { name: "Teknologi", slug: "teknologi", color: "#16a085", icon: "💻", order: 5 },
    { name: "Pendidikan", slug: "pendidikan", color: "#f39c12", icon: "🎓", order: 6 },
    { name: "Hukum", slug: "hukum", color: "#c0392b", icon: "⚖️", order: 7 },
    { name: "Olahraga", slug: "olahraga", color: "#d35400", icon: "⚽", order: 8 },
    { name: "Otomotif", slug: "otomotif", color: "#7f8c8d", icon: "🚗", order: 9 },
    { name: "Lifestyle", slug: "lifestyle", color: "#e91e63", icon: "✨", order: 10 },
    { name: "Hiburan", slug: "hiburan", color: "#9b59b6", icon: "🎬", order: 11 },
    { name: "Daerah", slug: "daerah", color: "#1abc9c", icon: "📍", order: 12 },
    { name: "Opini", slug: "opini", color: "#34495e", icon: "✍️", order: 13 },
    { name: "Video", slug: "video", color: "#e74c3c", icon: "🎥", order: 14 },
    { name: "Foto", slug: "foto", color: "#2ecc71", icon: "📷", order: 15 },
    { name: "Infografis", slug: "infografis", color: "#3498db", icon: "📈", order: 16 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✅ Categories created");

  // ===== TAGS =====
  const tags = [
    "Pemerintah", "DPR", "KPK", "Presiden", "Jakarta",
    "Ekonomi", "Investasi", "APBN", "Pendidikan", "Kesehatan",
    "Teknologi", "AI", "Startup", "Olahraga", "Timnas",
    "Liga1", "Badminton", "Hukum", "Korupsi", "Lingkungan",
  ];

  for (const tagName of tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-");
    await prisma.tag.upsert({
      where: { slug },
      update: { name: tagName },
      create: { name: tagName, slug },
    });
  }
  console.log("✅ Tags created");

  // ===== SUPER ADMIN =====
  const adminPassword = await bcrypt.hash("Admin@PenaSakti2026!", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@penasakti.com" },
    update: {},
    create: {
      email: "superadmin@penasakti.com",
      name: "Super Admin PenaSakti",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log("✅ Super Admin created: superadmin@penasakti.com");

  // ===== DEMO USERS =====
  const journalistPassword = await bcrypt.hash("Journalist@123!", 12);
  const journalist = await prisma.user.upsert({
    where: { email: "redaksi@penasakti.com" },
    update: {},
    create: {
      email: "redaksi@penasakti.com",
      name: "Ahmad Fauzi",
      password: journalistPassword,
      role: Role.JOURNALIST,
      emailVerified: new Date(),
      bio: "Jurnalis senior PenaSakti dengan 10+ tahun pengalaman.",
      isActive: true,
    },
  });

  // ===== AUTHOR PROFILES =====
  await prisma.authorProfile.upsert({
    where: { userId: journalist.id },
    update: {},
    create: {
      userId: journalist.id,
      slug: "ahmad-fauzi",
      displayName: "Ahmad Fauzi",
      bio: "Jurnalis senior PenaSakti yang berfokus pada isu politik dan ekonomi nasional.",
      expertise: ["Politik", "Ekonomi", "Hukum"],
      isVerified: true,
    },
  });
  console.log("✅ Demo users created");

  // ===== DEMO ARTICLES =====
  const nasionalCat = await prisma.category.findUnique({ where: { slug: "nasional" } });
  const ekonomiCat = await prisma.category.findUnique({ where: { slug: "ekonomi" } });
  const teknologiCat = await prisma.category.findUnique({ where: { slug: "teknologi" } });
  const olahragaCat = await prisma.category.findUnique({ where: { slug: "olahraga" } });

  const demoArticles = [
    {
      title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun untuk Pemulihan Nasional",
      slug: "presiden-umumkan-paket-stimulus-ekonomi",
      excerpt: "Pemerintah menggelontorkan stimulus besar-besaran untuk mendorong pertumbuhan ekonomi nasional yang ditargetkan mencapai 6% pada tahun ini.",
      content: "<p>JAKARTA - Presiden Republik Indonesia resmi mengumumkan paket stimulus ekonomi senilai Rp 500 triliun dalam konferensi pers di Istana Negara.</p><h2>Fokus Stimulus</h2><p>Paket stimulus ini mencakup berbagai sektor strategis nasional untuk mendorong pertumbuhan ekonomi.</p>",
      categoryId: ekonomiCat?.id || "",
      status: ArticleStatus.PUBLISHED,
      isBreaking: true,
      isFeatured: true,
      viewCount: BigInt(125000),
      readTime: 5,
    },
    {
      title: "Timnas Indonesia Lolos ke Final Piala AFF 2026, Siap Rebut Gelar Perdana",
      slug: "timnas-indonesia-lolos-final-piala-aff",
      excerpt: "Garuda Nusantara memastikan tiket final setelah mengalahkan Vietnam 3-1 dalam laga seru di GBK.",
      content: "<p>JAKARTA - Timnas Indonesia berhasil lolos ke final Piala AFF 2026 setelah mengalahkan Vietnam dengan skor 3-1 di Stadion Gelora Bung Karno.</p>",
      categoryId: olahragaCat?.id || "",
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      viewCount: BigInt(98000),
      readTime: 3,
    },
    {
      title: "Apple Investasi Rp 45 Triliun di Indonesia untuk Pabrik Komponen iPhone",
      slug: "apple-investasi-indonesia-pabrik-komponen",
      excerpt: "Apple akan membangun fasilitas produksi komponen iPhone di Batam senilai 3 miliar dolar AS.",
      content: "<p>JAKARTA - Raksasa teknologi Apple resmi mengumumkan investasi senilai Rp 45 triliun atau sekitar 3 miliar dolar AS untuk membangun pabrik komponen iPhone di Batam.</p>",
      categoryId: teknologiCat?.id || "",
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      viewCount: BigInt(45200),
      readTime: 4,
    },
    {
      title: "KPK Tangkap Kepala Dinas dalam Operasi Tangkap Tangan di Jakarta",
      slug: "kpk-tangkap-kepala-dinas-ott-jakarta",
      excerpt: "Komisi Pemberantasan Korupsi menangkap seorang kepala dinas terkait dugaan suap proyek pengadaan.",
      content: "<p>JAKARTA - Komisi Pemberantasan Korupsi (KPK) melakukan operasi tangkap tangan (OTT) terhadap seorang kepala dinas di Jakarta terkait dugaan suap.</p>",
      categoryId: nasionalCat?.id || "",
      status: ArticleStatus.PUBLISHED,
      isBreaking: true,
      viewCount: BigInt(87000),
      readTime: 3,
    },
    {
      title: "Harga Beras di Jakarta Turun Rp 500 per Kilogram Usai Panen Raya",
      slug: "harga-beras-jakarta-turun-panen-raya",
      excerpt: "Harga beras di pasar tradisional Jakarta mengalami penurunan seiring masuknya hasil panen raya.",
      content: "<p>JAKARTA - Harga beras di sejumlah pasar tradisional Jakarta mengalami penurunan rata-rata Rp 500 per kilogram menyusul masuknya pasokan dari panen raya di beberapa daerah penghasil beras utama.</p>",
      categoryId: ekonomiCat?.id || "",
      status: ArticleStatus.PUBLISHED,
      viewCount: BigInt(34500),
      readTime: 3,
    },
  ];

  for (const article of demoArticles) {
    if (!article.categoryId) continue;
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        authorId: journalist.id,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 3600000),
        featuredImage: `https://picsum.photos/seed/${article.slug}/1200/600`,
      },
    });
  }
  console.log("✅ Demo articles created");

  // ===== SITE SETTINGS =====
  await prisma.siteSettings.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      siteName: "PenaSakti",
      siteUrl: "https://penasakti.com",
      siteDescription: "Portal berita nasional terpercaya Indonesia",
      footerText: "© 2026 PenaSakti. Hak Cipta Dilindungi. PT PenaSakti Media Digital.",
    },
  });
  console.log("✅ Site settings created");

  console.log("\n🎉 Seeding selesai! Akun admin:\n");
  console.log("   Email: superadmin@penasakti.com");
  console.log("   Password: Admin@PenaSakti2026!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
