import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";
  
  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + "..." : "EMPTY",
    hasDirectUrl: !!directUrl,
    directUrlPrefix: directUrl ? directUrl.substring(0, 30) + "..." : "EMPTY",
    nodeEnv: process.env.NODE_ENV,
  });
}
