import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

  if (!databaseUrl || databaseUrl.includes("localhost") || databaseUrl.includes("build:build")) {
    // No real DB configured - create dummy client that errors on queries
    const pool = new Pool({ connectionString: "postgresql://x:x@localhost:5432/x" });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
