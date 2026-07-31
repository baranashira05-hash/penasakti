/**
 * Fix ogImage dan featuredImage yang broken — versi bulk dengan raw SQL
 */
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });

function extractFirstImage(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  const src = match[1];
  if (src.includes("penasakti.com/wp-content/")) return null;
  if (src.includes("cdn.penasakti.com/")) return null;
  if (!src.startsWith("https://")) return null;
  return src;
}

async function main() {
  console.log("=== Fix Broken OG Images ===\n");

  // ── 1. Bulk clear ogImage broken ─────────────────────────────────────────
  const r1 = await pool.query(`
    UPDATE articles
    SET "ogImage" = NULL
    WHERE "ogImage" IS NOT NULL
      AND ("ogImage" LIKE '%wp-content%' OR "ogImage" LIKE '%cdn.penasakti.com%')
  `);
  console.log(`✅ ogImage cleared: ${r1.rowCount}`);

  // ── 2. Artikel tanpa featuredImage → extract dari konten HTML ─────────────
  const rows = await pool.query(`
    SELECT id, content
    FROM articles
    WHERE status = 'PUBLISHED'
      AND ("featuredImage" IS NULL OR "featuredImage" = '')
      AND content IS NOT NULL AND content != ''
    ORDER BY "publishedAt" DESC
  `);
  console.log(`Artikel tanpa gambar: ${rows.rows.length}`);

  let extracted = 0;
  const BATCH = 200;

  for (let i = 0; i < rows.rows.length; i += BATCH) {
    const batch = rows.rows.slice(i, i + BATCH);
    const updates: { id: string; url: string }[] = [];

    for (const row of batch) {
      const url = extractFirstImage(row.content);
      if (url) updates.push({ id: row.id, url });
    }

    if (updates.length > 0) {
      // Satu query UPDATE per item — sederhana dan pasti benar
      for (const u of updates) {
        await pool.query(
          `UPDATE articles SET "featuredImage" = $1 WHERE id = $2`,
          [u.url, u.id]
        );
        extracted++;
      }
    }
    process.stdout.write(`\r  ${Math.min(i + BATCH, rows.rows.length)}/${rows.rows.length} diproses | ${extracted} diekstrak`);
  }
  console.log("\n");

  // ── Laporan ──────────────────────────────────────────────────────────────
  const s = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'PUBLISHED') as total,
      COUNT(*) FILTER (WHERE status = 'PUBLISHED' AND "featuredImage" IS NOT NULL AND "featuredImage" != '') as with_img,
      COUNT(*) FILTER (WHERE status = 'PUBLISHED' AND ("featuredImage" IS NULL OR "featuredImage" = '')) as no_img,
      COUNT(*) FILTER (WHERE "featuredImage" LIKE '%cloudinary%') as cloudinary,
      COUNT(*) FILTER (WHERE "ogImage" LIKE '%wp-content%') as broken_og_left
    FROM articles
  `);
  const r = s.rows[0];
  console.log("=== HASIL AKHIR ===");
  console.log(`Total published        : ${r.total}`);
  console.log(`✅ Punya featuredImage : ${r.with_img}`);
  console.log(`  - Cloudinary         : ${r.cloudinary}`);
  console.log(`✅ Diekstrak dari HTML : ${extracted}`);
  console.log(`⚠️  Masih tanpa gambar : ${r.no_img}`);
  console.log(`❌ ogImage broken left : ${r.broken_og_left}`);
}

main().catch(console.error).finally(() => pool.end());
