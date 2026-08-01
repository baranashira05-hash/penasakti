/**
 * GET /api/seo/indexnow-key
 * Rewrite: GET /<INDEXNOW_KEY>.txt
 *
 * IndexNow membutuhkan file verifikasi di domain untuk membuktikan kepemilikan.
 * Dengan route handler ini, file kunci tidak perlu disimpan di /public.
 *
 * Tambahkan di next.config.ts:
 * { source: "/:key([0-9a-f]{32}).txt", destination: "/api/seo/indexnow-key" }
 *
 * Ref: https://www.indexnow.org/faq
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return new NextResponse("Not configured", { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
