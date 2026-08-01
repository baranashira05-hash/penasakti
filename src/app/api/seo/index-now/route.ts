/**
 * GET /api/seo/index-now?slug=...
 * POST /api/seo/index-now  (body: { slug: string } | { urls: string[] })
 *
 * Endpoint internal untuk trigger IndexNow ping secara manual atau dari webhook.
 * Digunakan oleh publish hooks.
 *
 * Security: Hanya bisa diakses dengan REVALIDATE_SECRET header.
 */

import { NextRequest, NextResponse } from "next/server";
import { pingIndexNow } from "@/lib/publish-hooks";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret") || req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  await pingIndexNow(slug);
  return NextResponse.json({ success: true, slug });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.slug as string;

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    await pingIndexNow(slug);
    return NextResponse.json({ success: true, slug });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
