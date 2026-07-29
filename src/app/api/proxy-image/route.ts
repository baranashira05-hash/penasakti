import { NextRequest, NextResponse } from "next/server";

// Subdomain khusus yang pointing ke server lama Jagoan Hosting (DNS only, tidak lewat Vercel)
const CDN_BASE = "http://cdn.penasakti.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path || !path.startsWith("/wp-content/uploads/")) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const imageUrl = `${CDN_BASE}${path}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const imageRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!imageRes.ok) {
      console.error(`Proxy failed: ${imageUrl} → ${imageRes.status}`);
      return new NextResponse("Image not found", { status: 404 });
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error.message);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
