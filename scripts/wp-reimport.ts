/**
 * ============================================================
 * SCRIPT RE-IMPORT PENUH DARI WORDPRESS → DATABASE BARU
 * ============================================================
 * Apa yang dilakukan script ini:
 * 1. Fetch semua post, kategori, tag, author dari WP REST API
 * 2. Download gambar featured dari WP → upload ke Cloudinary
 * 3. Update/insert artikel ke database (upsert by slug)
 * 4. Update gambar di konten artikel (src URL WP → Cloudinary)
 *
 * Cara pakai:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/wp-reimport.ts
 *
 * Mode:
 *   --dry-run   → hanya tampilkan data, tidak simpan ke DB
 *   --skip-img  → skip upload gambar, pakai URL WP langsung
 *   --only-img  → hanya update gambar artikel yang sudah ada
 * ============================================================
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

// ====== KONFIGURASI ======
// Akses WordPress langsung via IP server hosting (Jagoan Hosting)
// karena domain penasakti.com sudah pointing ke Vercel
const WP_HOST_OVERRIDE = process.env.WP_HOST_IP || "101.50.1.121";
const WP_API = `http://${WP_HOST_OVERRIDE}/wp-json/wp/v2`;
const PER_PAGE = 100;
const DELAY_MS = 300; // jeda antar request untuk hindari rate limit
const CLOUDINARY_FOLDER = "penasakti/wp-import";

// Parse argumen CLI
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SKIP_IMG = args.includes("--skip-img");
const ONLY_IMG = args.includes("--only-img");

// ====== DATABASE ======
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ====== CLOUDINARY ======
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ====== INTERFACES ======
interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_image?: { url: string }[];
  };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
    author?: { id: number; name: string; slug: string; description?: string; avatar_urls?: Record<string, string> }[];
    "wp:term"?: Array<{ id: number; name: string; slug: string; taxonomy: string }[]>;
  };
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
}

interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// ====== UTILITY ======
function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function log(msg: string) {
  console.log(msg);
}

function cleanHtml(html: string): string {
  return html
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gi, "$1")
    .replace(/\[.*?\]/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

function calcReadTime(content: string): number {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100)
    .trim();
}

// ====== FETCH WP DATA (pakai http module agar Host header bisa di-override) ======
function httpGet(path: string): Promise<{ body: string; headers: { [key: string]: string | string[] | undefined } }> {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: WP_HOST_OVERRIDE,
      port: 80,
      path,
      method: "GET",
      headers: {
        "Host": "penasakti.com",
        "User-Agent": "Mozilla/5.0 (compatible; PenaSakti-Migrator/2.0)",
        "Accept": "application/json",
      },
      timeout: 20000,
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({
        body: Buffer.concat(chunks).toString("utf8"),
        headers: res.headers as { [key: string]: string | string[] | undefined },
      }));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

async function fetchWP<T>(url: string, retries = 3): Promise<{ data: T; headers: { [key: string]: string | string[] | undefined } }> {
  // Ambil path dari URL (buang http://IP bagian depan)
  const urlObj = new URL(url);
  const path = urlObj.pathname + urlObj.search;

  for (let i = 0; i < retries; i++) {
    try {
      const { body, headers } = await httpGet(path);
      const statusHeader = headers["x-wp-total"];
      // Cek apakah response adalah JSON valid
      if (body.startsWith("[") || body.startsWith("{")) {
        const data = JSON.parse(body) as T;
        return { data, headers };
      }
      throw new Error(`Response bukan JSON: ${body.substring(0, 100)}`);
    } catch (e: any) {
      if (i === retries - 1) throw e;
      log(`  ⏳ Retry ${i + 1}/${retries}: ${e.message?.substring(0, 60)}`);
      await delay(1000 * (i + 1));
    }
  }
  throw new Error(`Gagal fetch: ${url}`);
}

async function fetchAllPages<T>(endpoint: string, extraParams = ""): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  while (true) {
    const sep = extraParams ? "&" : "";
    const path = `/wp-json/wp/v2/${endpoint}?per_page=${PER_PAGE}&page=${page}${extraParams ? sep + extraParams : ""}`;
    const url = `http://${WP_HOST_OVERRIDE}${path}`;
    try {
      const { data, headers } = await fetchWP<T[]>(url);
      all.push(...data);
      const totalPagesStr = headers["x-wp-totalpages"] || headers["X-WP-TotalPages"];
      const totalPages = parseInt((Array.isArray(totalPagesStr) ? totalPagesStr[0] : totalPagesStr) || "1");
      if (page >= totalPages) break;
      page++;
      await delay(DELAY_MS);
    } catch {
      break;
    }
  }

  return all;
}

// Download gambar via IP dengan Host header override (Node.js http module)
function downloadImage(ipUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Parse URL untuk ambil path
    const urlObj = new URL(ipUrl);
    const req = http.request({
      hostname: WP_HOST_OVERRIDE,
      port: 80,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: {
        "Host": "penasakti.com",
        "User-Agent": "Mozilla/5.0 (compatible; PenaSakti-Migrator/2.0)",
        "Referer": "https://penasakti.com/",
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

// Upload URL gambar ke Cloudinary
// Download dulu via IP lokal, lalu upload buffer ke Cloudinary
async function uploadImageToCloudinary(imageUrl: string, publicId: string): Promise<string | null> {
  if (SKIP_IMG) return imageUrl;

  // Cek dulu apakah sudah ada di Cloudinary
  try {
    const existing = await cloudinary.api.resource(`${CLOUDINARY_FOLDER}/${publicId}`);
    return existing.secure_url;
  } catch {}

  try {
    // Download gambar via IP
    const buffer = await downloadImage(imageUrl);

    // Upload buffer ke Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: CLOUDINARY_FOLDER,
          resource_type: "image",
          overwrite: false,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return result.secure_url;
  } catch (e: any) {
    if (e.http_code === 409 || (e.message && e.message.includes("already exists"))) {
      try {
        const existing = await cloudinary.api.resource(`${CLOUDINARY_FOLDER}/${publicId}`);
        return existing.secure_url;
      } catch {}
    }
    return null;
  }
}

// Update URL gambar dalam konten artikel
async function updateContentImages(content: string, slug: string): Promise<string> {
  if (SKIP_IMG) return content;

  // Cari semua URL gambar WP dalam konten
  const imgRegex = /https?:\/\/(www\.)?penasakti\.com\/wp-content\/uploads\/[^\s"'>)]+/g;
  const matchArr = content.match(imgRegex) || [];
  const urlSet: { [key: string]: boolean } = {};
  for (const u of matchArr) urlSet[u] = true;
  const urls = Object.keys(urlSet);

  if (urls.length === 0) return content;

  let updated = content;
  for (const url of urls) {
    try {
      const filename = url.split("/").pop()?.replace(/[^a-zA-Z0-9.-]/g, "_") || "";
      const publicId = `${slug}-content-${filename}`.substring(0, 80);
      const cloudUrl = await uploadImageToCloudinary(url, publicId);
      if (cloudUrl) {
        updated = updated.split(url).join(cloudUrl);
      }
    } catch {}
    await delay(100);
  }

  return updated;
}

// ====== MAIN LOGIC ======
async function checkWordPressAccess(): Promise<boolean> {
  try {
    log("🔍 Cek akses WordPress API...");
    const url = `http://${WP_HOST_OVERRIDE}/wp-json/wp/v2/posts?per_page=1&status=publish`;
    const { data } = await fetchWP<any[]>(url);
    if (Array.isArray(data) && data.length > 0) {
      log("✅ WordPress API dapat diakses\n");
      return true;
    }
    log("⚠️  WordPress API merespons tapi tidak ada post");
    return false;
  } catch (e: any) {
    log(`❌ WordPress API tidak bisa diakses: ${e.message}`);
    return false;
  }
}

async function checkCloudinary(): Promise<boolean> {
  if (SKIP_IMG) {
    log("⏭️  Cloudinary dilewati (--skip-img)\n");
    return true;
  }
  try {
    log("🔍 Cek koneksi Cloudinary...");
    await cloudinary.api.ping();
    log("✅ Cloudinary OK\n");
    return true;
  } catch (e: any) {
    log(`❌ Cloudinary error: ${e.message}`);
    log("   Tambahkan CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET di .env");
    log("   Atau jalankan dengan --skip-img untuk lewati upload gambar\n");
    return false;
  }
}

async function importCategories(): Promise<Map<number, string>> {
  log("📁 Import kategori dari WordPress...");
  const wpCategories = await fetchAllPages<WPCategory>("categories");
  log(`   Ditemukan: ${wpCategories.length} kategori`);

  const wpIdToDbId = new Map<number, string>();
  let created = 0;
  let existed = 0;

  // Proses parent kategori dulu
  const sorted = [...wpCategories].sort((a, b) => a.parent - b.parent);

  for (const cat of sorted) {
    if (cat.count === 0) continue; // skip kategori kosong
    if (cat.slug === "uncategorized") continue;

    const catSlug = slugify(cat.name) || cat.slug;

    if (DRY_RUN) {
      log(`   [dry] Kategori: ${cat.name} (${catSlug})`);
      continue;
    }

    try {
      const parentId = cat.parent ? wpIdToDbId.get(cat.parent) : null;

      const existing = await prisma.category.findFirst({
        where: { OR: [{ slug: catSlug }, { name: cat.name }] },
      });

      if (existing) {
        wpIdToDbId.set(cat.id, existing.id);
        existed++;
      } else {
        const created_ = await prisma.category.create({
          data: {
            name: cat.name,
            slug: catSlug,
            description: cat.description || null,
            parentId: parentId || null,
            isActive: true,
            order: 0,
          },
        });
        wpIdToDbId.set(cat.id, created_.id);
        created++;
      }
    } catch (e: any) {
      log(`   ⚠️  Skip kategori ${cat.name}: ${e.message?.substring(0, 60)}`);
    }
  }

  log(`   ✅ Baru: ${created}, Sudah ada: ${existed}\n`);
  return wpIdToDbId;
}

async function importTags(): Promise<Map<number, string>> {
  log("🏷️  Import tag dari WordPress...");
  const wpTags = await fetchAllPages<WPTag>("tags");
  log(`   Ditemukan: ${wpTags.length} tag`);

  const wpIdToDbId = new Map<number, string>();
  let created = 0;
  let existed = 0;

  for (const tag of wpTags) {
    if (tag.count === 0) continue;
    const tagSlug = slugify(tag.name) || tag.slug;

    if (DRY_RUN) continue;

    try {
      const existing = await prisma.tag.findFirst({
        where: { OR: [{ slug: tagSlug }, { name: tag.name }] },
      });

      if (existing) {
        wpIdToDbId.set(tag.id, existing.id);
        existed++;
      } else {
        const created_ = await prisma.tag.create({
          data: { name: tag.name, slug: tagSlug },
        });
        wpIdToDbId.set(tag.id, created_.id);
        created++;
      }
    } catch {}
  }

  log(`   ✅ Baru: ${created}, Sudah ada: ${existed}\n`);
  return wpIdToDbId;
}

async function getOrCreateDefaultAuthor(): Promise<string> {
  // Cari admin/editor yang ada di database
  const admin = await prisma.user.findFirst({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN", "EDITOR"] } },
    orderBy: { createdAt: "asc" },
  });

  if (admin) return admin.id;

  // Cari user mana saja
  const anyUser = await prisma.user.findFirst();
  if (anyUser) return anyUser.id;

  throw new Error("Tidak ada user di database! Jalankan scripts/create-admin.ts dulu.");
}

async function getOrCreateDefaultCategory(): Promise<string> {
  const cat = await prisma.category.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (cat) return cat.id;

  // Buat kategori default
  const created = await prisma.category.create({
    data: { name: "Umum", slug: "umum", isActive: true, order: 0 },
  });
  return created.id;
}

async function importArticles(
  categoryMap: Map<number, string>,
  tagMap: Map<number, string>,
  defaultAuthorId: string,
  defaultCategoryId: string
) {
  log("📰 Import artikel dari WordPress...");

  // Hitung total dulu
  const countUrl = `http://${WP_HOST_OVERRIDE}/wp-json/wp/v2/posts?per_page=1&status=publish&_embed=true`;
  const { headers: countHeaders } = await fetchWP<any>(countUrl);
  const totalStr = countHeaders["x-wp-total"] || countHeaders["X-WP-Total"];
  const pagesStr = countHeaders["x-wp-totalpages"] || countHeaders["X-WP-TotalPages"];
  const totalPosts = parseInt((Array.isArray(totalStr) ? totalStr[0] : totalStr) || "0");
  const totalPages = parseInt((Array.isArray(pagesStr) ? pagesStr[0] : pagesStr) || "1");
  log(`   Total artikel: ${totalPosts} (${totalPages} halaman)\n`);

  let imported = 0;
  let updated = 0;
  let failed = 0;
  let imgUploaded = 0;
  let imgFailed = 0;

  for (let page = 1; page <= totalPages; page++) {
    log(`📄 Halaman ${page}/${totalPages}...`);

    const url = `http://${WP_HOST_OVERRIDE}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&status=publish&_embed=true`;
    const { data: posts } = await fetchWP<WPPost[]>(url);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const num = (page - 1) * PER_PAGE + i + 1;

      process.stdout.write(`   [${num}/${totalPosts}] ${post.slug?.substring(0, 45)}... `);

      try {
        // ===== AMBIL GAMBAR FEATURED =====
        let featuredImageUrl: string | null = null;
        const mediaEmbed = post._embedded?.["wp:featuredmedia"];
        const wpImageUrl = mediaEmbed?.[0]?.source_url || null;
        const imageAlt = mediaEmbed?.[0]?.alt_text || post.title.rendered;

        if (wpImageUrl && !SKIP_IMG) {
          const publicId = post.slug.substring(0, 60).replace(/[^a-z0-9-]/g, "-");
          const cloudUrl = await uploadImageToCloudinary(wpImageUrl, publicId);
          if (cloudUrl) {
            featuredImageUrl = cloudUrl;
            imgUploaded++;
          } else {
            featuredImageUrl = wpImageUrl; // fallback ke WP URL
            imgFailed++;
          }
        } else {
          featuredImageUrl = wpImageUrl;
        }

        // ===== PROSES KONTEN =====
        let content = cleanHtml(post.content.rendered);
        if (!SKIP_IMG) {
          content = await updateContentImages(content, post.slug);
        }

        // ===== TENTUKAN KATEGORI =====
        let categoryId = defaultCategoryId;
        for (const wpCatId of post.categories) {
          const dbCatId = categoryMap.get(wpCatId);
          if (dbCatId) {
            categoryId = dbCatId;
            break;
          }
        }

        // ===== META YOAST =====
        const yoast = post.yoast_head_json;
        const metaTitle = yoast?.title || post.title.rendered;
        const metaDesc = yoast?.description || post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160);

        // ===== HITUNG READ TIME =====
        const readTime = calcReadTime(content);

        if (DRY_RUN) {
          console.log(`[dry] ${post.title.rendered.substring(0, 50)}`);
          continue;
        }

        // ===== UPSERT ARTIKEL =====
        const articleData = {
          title: post.title.rendered,
          slug: post.slug,
          excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 500) || null,
          content,
          featuredImage: featuredImageUrl,
          featuredImageAlt: imageAlt || null,
          status: "PUBLISHED" as const,
          publishedAt: new Date(post.date),
          readTime,
          metaTitle,
          metaDesc,
          ogImage: yoast?.og_image?.[0]?.url || featuredImageUrl || null,
          authorId: defaultAuthorId,
          categoryId,
          source: "WordPress",
          sourceUrl: `https://penasakti.com/${post.slug}/`,
        };

        const existingArticle = await prisma.article.findUnique({
          where: { slug: post.slug },
          select: { id: true },
        });

        let articleId: string;

        if (existingArticle) {
          await prisma.article.update({
            where: { slug: post.slug },
            data: articleData,
          });
          articleId = existingArticle.id;
          updated++;
          process.stdout.write(`♻️  `);
        } else {
          const created = await prisma.article.create({ data: articleData });
          articleId = created.id;
          imported++;
          process.stdout.write(`✅ `);
        }

        // ===== UPSERT TAGS =====
        const tagIds: string[] = [];
        for (const wpTagId of post.tags) {
          const dbTagId = tagMap.get(wpTagId);
          if (dbTagId) tagIds.push(dbTagId);
        }

        if (tagIds.length > 0) {
          // Hapus tag lama, insert yang baru
          await prisma.articleTag.deleteMany({ where: { articleId } });
          await prisma.articleTag.createMany({
            data: tagIds.map(tagId => ({ articleId, tagId })),
            skipDuplicates: true,
          });
        }

        console.log(featuredImageUrl?.includes("cloudinary") ? "🖼️" : "");
      } catch (e: any) {
        failed++;
        console.log(`❌ ${e.message?.substring(0, 60)}`);
      }

      await delay(DELAY_MS);
    }

    await delay(500); // jeda antar halaman
  }

  log(`\n=== HASIL IMPORT ARTIKEL ===`);
  log(`✅ Import baru  : ${imported}`);
  log(`♻️  Update ada  : ${updated}`);
  log(`❌ Gagal        : ${failed}`);
  if (!SKIP_IMG) {
    log(`🖼️  Img Cloudinary: ${imgUploaded}`);
    log(`⚠️  Img WP fallback: ${imgFailed}`);
  }
}

async function showStatus() {
  log("\n=== STATUS DATABASE SETELAH IMPORT ===");
  const total = await prisma.article.count();
  const published = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const withImg = await prisma.article.count({ where: { featuredImage: { not: null } } });
  const cloudinaryImg = await prisma.article.count({ where: { featuredImage: { contains: "cloudinary" } } });
  const wpImg = await prisma.article.count({ where: { featuredImage: { contains: "wp-content" } } });
  const categories = await prisma.category.count();
  const tags = await prisma.tag.count();

  log(`📰 Total artikel    : ${total}`);
  log(`✅ Published        : ${published}`);
  log(`🖼️  Dengan gambar   : ${withImg}`);
  log(`   → Cloudinary     : ${cloudinaryImg}`);
  log(`   → WP (mungkin broken): ${wpImg}`);
  log(`📁 Kategori         : ${categories}`);
  log(`🏷️  Tag              : ${tags}`);
}

async function main() {
  log("╔══════════════════════════════════════════════════╗");
  log("║   PENASAKTI - RE-IMPORT DARI WORDPRESS           ║");
  log("╚══════════════════════════════════════════════════╝\n");

  if (DRY_RUN) log("⚠️  MODE DRY RUN - tidak ada perubahan ke database\n");
  if (SKIP_IMG) log("⚠️  MODE SKIP IMG - gambar tidak diupload ke Cloudinary\n");
  if (ONLY_IMG) log("⚠️  MODE ONLY IMG - hanya update gambar artikel yang ada\n");

  // Cek koneksi
  const wpOk = await checkWordPressAccess();
  if (!wpOk) {
    log("❌ Hentikan: WordPress tidak bisa diakses");
    return;
  }

  const cloudOk = await checkCloudinary();
  if (!cloudOk && !SKIP_IMG) {
    log("❌ Hentikan: Cloudinary tidak bisa diakses");
    log("   Jalankan dengan --skip-img untuk lewati gambar");
    return;
  }

  // Mode ONLY_IMG: hanya update gambar artikel yang sudah ada
  if (ONLY_IMG) {
    log("🖼️  Mode: hanya update gambar yang masih pakai URL WP...");
    const articles = await prisma.article.findMany({
      where: { featuredImage: { contains: "wp-content/uploads" } },
      select: { id: true, slug: true, featuredImage: true },
    });
    log(`   Artikel dengan gambar WP: ${articles.length}`);

    let fixed = 0;
    let failed = 0;
    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      if (!a.featuredImage) continue;
      process.stdout.write(`[${i + 1}/${articles.length}] ${a.slug?.substring(0, 40)}... `);
      const publicId = a.slug?.replace(/[^a-z0-9-]/g, "-").substring(0, 60) || a.id;
      const cloudUrl = await uploadImageToCloudinary(a.featuredImage, publicId);
      if (cloudUrl && cloudUrl.includes("cloudinary")) {
        await prisma.article.update({ where: { id: a.id }, data: { featuredImage: cloudUrl } });
        fixed++;
        console.log("✅");
      } else {
        failed++;
        console.log("❌");
      }
      await delay(200);
    }
    log(`\n✅ Fixed: ${fixed}  ❌ Gagal: ${failed}`);
    await showStatus();
    return;
  }

  // Import normal
  const defaultAuthorId = await getOrCreateDefaultAuthor();
  log(`👤 Default author ID: ${defaultAuthorId}\n`);

  const categoryMap = await importCategories();
  const tagMap = await importTags();
  const defaultCategoryId = await getOrCreateDefaultCategory();

  await importArticles(categoryMap, tagMap, defaultAuthorId, defaultCategoryId);
  await showStatus();

  log("\n🎉 Re-import selesai!");
  log("   Refresh penasakti.com untuk melihat hasilnya.");
}

main()
  .catch(e => {
    console.error("\n❌ Error fatal:", e.message);
    console.error(e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
