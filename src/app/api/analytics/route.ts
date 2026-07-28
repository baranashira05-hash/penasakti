import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, sessionId } = body;

    const ua = request.headers.get("user-agent") ?? "";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const { prisma } = await import("@/lib/prisma");

    await prisma.analytics.create({
      data: {
        page: page ?? "/",
        referrer: referrer ?? null,
        userAgent: ua,
        ipAddress: ip,
        sessionId: sessionId ?? null,
        device: /mobile/i.test(ua) ? "mobile" : /tablet/i.test(ua) ? "tablet" : "desktop",
        browser: /Chrome/.test(ua)
          ? "Chrome"
          : /Firefox/.test(ua)
          ? "Firefox"
          : /Safari/.test(ua)
          ? "Safari"
          : "Other",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Fail silently — analytics should never break the app
    return NextResponse.json({ success: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getServerSession } = await import("next-auth");
    const { default: authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { prisma } = await import("@/lib/prisma");

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalViews, deviceStats] = await Promise.all([
      prisma.analytics.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.analytics.groupBy({
        by: ["device"],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { device: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { totalViews, deviceStats },
    });
  } catch (error) {
    console.error("[/api/analytics GET]", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil analytics" }, { status: 500 });
  }
}
