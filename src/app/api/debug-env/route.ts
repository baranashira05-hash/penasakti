import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";
  
  let articleCount = 0;
  let dbConnected = false;
  try {
    articleCount = await prisma.article.count();
    dbConnected = true;
  } catch (e) {
    dbConnected = false;
  }

  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + "..." : "EMPTY",
    hasDirectUrl: !!directUrl,
    directUrlPrefix: directUrl ? directUrl.substring(0, 30) + "..." : "EMPTY",
    nodeEnv: process.env.NODE_ENV,
    dbConnected,
    articleCount,
  });
}
