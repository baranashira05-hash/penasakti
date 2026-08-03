/**
 * GET /api/admin/security
 *
 * Dashboard keamanan — menampilkan statistik event keamanan hari ini.
 * Hanya bisa diakses oleh admin.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { getSecurityStats } from "@/lib/security-logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getSecurityStats();

    return NextResponse.json({
      success: true,
      data: {
        date: new Date().toISOString().split("T")[0],
        events: stats,
        summary: {
          totalBlocked: Object.values(stats).reduce((a, b) => a + b, 0),
          loginAttacks: (stats.login_failed || 0) + (stats.brute_force_blocked || 0),
          scrapingAttempts: stats.scrape_attempt || 0,
          xssAttempts: stats.xss_attempt || 0,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
