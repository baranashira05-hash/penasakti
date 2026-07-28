import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function getConnectionString(): string {
  return process.env.DATABASE_URL || process.env.DIRECT_URL || "";
}

function createPrismaClient(): PrismaClient {
  const url = getConnectionString();

  const pool = new Pool({
    connectionString: url || "postgresql://skip:skip@localhost:5432/skip",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// In production on Vercel (serverless), don't cache across requests
// Each function invocation gets fresh connection
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createPrismaClient();
  }
  prisma = globalForPrisma.__prisma;
}

export default prisma;

export { prisma };
