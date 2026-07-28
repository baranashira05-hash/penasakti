/**
 * Prisma singleton dengan PrismaPg adapter (Prisma v7).
 * Gracefully handles missing DATABASE_URL at build time.
 */

import { PrismaClient } from "@prisma/client";

// Lazy-loaded adapter to avoid build-time errors when DATABASE_URL is absent
let _prisma: PrismaClient | null = null;

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (url) {
    try {
      // Dynamically require to avoid build-time import resolution issues
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaPg } = require("@prisma/adapter-pg");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Pool } = require("pg");

      const pool = new Pool({
        connectionString: url,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      const adapter = new PrismaPg(pool);

      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
    } catch (e) {
      console.error("[Prisma] Failed to create adapter client:", e);
    }
  }

  // Fallback: no adapter — works in build / test environments without a real DB.
  // All DB calls will throw at runtime; handled by each API route individually.
  return new PrismaClient({
    log: ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma._prisma ?? (globalForPrisma._prisma = createClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma._prisma = prisma;
}

export default prisma;
