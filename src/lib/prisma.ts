import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __prismaPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function getConnectionString(): string {
  return process.env.DATABASE_URL || process.env.DIRECT_URL || "";
}

function getPool(): Pool {
  // Reuse pool di semua environment — krusial untuk Vercel serverless
  // yang bisa memiliki banyak cold start sekaligus
  if (globalThis.__prismaPool) return globalThis.__prismaPool;

  const pool = new Pool({
    connectionString: getConnectionString() || "postgresql://skip:skip@localhost:5432/skip",
    // Vercel serverless: maksimal 5 koneksi per instance
    // (Supabase pgBouncer mengelola pooling di sisi server)
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Penting untuk pgBouncer: jangan gunakan prepared statements
    // karena pgBouncer dalam transaction mode tidak support prepared statements
  });

  globalThis.__prismaPool = pool;
  return pool;
}

function createPrismaClient(): PrismaClient {
  const pool = getPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// Singleton pattern — satu instance untuk seluruh lifetime process
// Ini penting agar tidak terjadi connection pool exhaustion di Vercel
let prisma: PrismaClient;

if (globalThis.__prisma) {
  prisma = globalThis.__prisma;
} else {
  prisma = createPrismaClient();
  globalThis.__prisma = prisma;
}

export default prisma;
export { prisma };
