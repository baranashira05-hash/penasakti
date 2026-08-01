/**
 * POST /api/revalidate
 *
 * Endpoint untuk memaksa revalidasi cache ISR secara manual.
 * Bisa dipanggil dari:
 * - Vercel Deploy Hooks
 * - Webhook dari CMS eksternal
 * - Script cron
 *
 * Body: { slug?: string; path?: string; all?: boolean }
 * Header: x-revalidate-secret: <REVALIDATE_SECRET>
 *
 * Contoh:
 *   curl -X POST https://www.penasakti.com/api/revalidate \
 *     -H "x-revalidate-secret: your_secret" \
 *     -H "Content-Type: application/json" \
 *     -d '{"slug": "nama-artikel-slug"}'
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runAllPublishHooks } from "@/lib/publish-hooks";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { slug, path, all, categorySlug } = body as {
      slug?: string;
      path?: string;
      all?: boolean;
      categorySlug?: string;
    };

    if (all) {
      // Revalidasi semua halaman utama
      revalidatePath("/");
      revalidatePath("/", "layout");
      revalidatePath("/kategori/[slug]", "page");
      return NextResponse.json({ success: true, revalidated: "all" });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ success: true, revalidated: path });
    }

    if (slug) {
      await runAllPublishHooks({ slug, categorySlug: categorySlug ?? null });
      return NextResponse.json({ success: true, revalidated: `/artikel/${slug}` });
    }

    return NextResponse.json({ error: "Provide slug, path, or all=true" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  return NextResponse.json({ success: true, revalidated: path, ts: Date.now() });
}
