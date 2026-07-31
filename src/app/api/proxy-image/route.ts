import { NextRequest, NextResponse } from "next/server";

// Domain yang diizinkan untuk di-proxy (whitelist)
const ALLOWED_DOMAINS = [
  "i.postimg.cc",
  "postimg.cc",
  "cdn.penasakti.com",
  "penasakti.com",
  "www.penasakti.com",
  "res.cloudinary.com",
  "images.unsplash.com",
  "i.imgur.com",
];

// Subdomain CDN lama (HTTP only)
const CDN_BASE = "http://cdn.penasakti.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Mode 1: path=/wp-content/uploads/... (legacy, via cdn.penasakti.com)
    const path = searchParams.get("path");
    if (path) {
      if (!path.startsWith("/wp-content/uploads/")) {
        return new NextResponse("Invalid path", { status: 400 });
      }
      return proxyUrl(`${CDN_BASE}${path}`);
    }

    // Mode 2: url=https://i.postimg.cc/... (arbitrary external URL, whitelisted)
    const rawUrl = searchParams.get("url");
    if (!rawUrl) {
      return new NextResponse("Missing url or path parameter", { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return new NextResponse("Invalid URL", { status: 400 });
    }

    // Validasi domain whitelist
    const hostname = parsedUrl.hostname.toLowerCase();
    const isAllowed = ALLOWED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    );
    if (!isAllowed) {
      return new NextResponse("Domain not allowed", { status: 403 });
    }

    return proxyUrl(rawUrl);
  } catch (error: any) {
    console.error("Image proxy error:", error.message);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}

async function proxyUrl(imageUrl: string): Promise<NextResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const imageRes = await fetch(imageUrl, {
      headers: {
        // Impersonate browser — postimg.cc blocks bot UAs
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/webp,image/avif,image/apng,image/jpeg,image/*,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
        Referer: "https://www.penasakti.com/",
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
        // Cache 7 hari di CDN Vercel — OG image tidak sering berubah
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    clearTimeout(timeout);
    console.error(`Proxy fetch error for ${imageUrl}:`, err.message);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
