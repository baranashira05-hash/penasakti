import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });

async function main() {
  const r = await pool.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `);
  console.log("Tables:", r.rows.map((r: any) => r.tablename).join(", "));

  // Cek nama kolom tabel artikel
  const cols = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name ILIKE '%article%'
    ORDER BY ordinal_position LIMIT 20
  `);
  console.log("\nArtikel columns:", cols.rows.map((r: any) => r.column_name).join(", "));
}
main().catch(console.error).finally(() => pool.end());
