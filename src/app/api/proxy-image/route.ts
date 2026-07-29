import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Gunakan subdomain yang TIDAK di-proxy Cloudflare dan pointing langsung ke server lama
// Atau gunakan IP langsung dengan header Host yang benar
const OLD_SERVER_IP = "161.50.1.21";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path || !path.startsWith("/wp-content/uploads/")) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    // Fetch langsung ke IP server lama
    const imageUrl = `http://${OLD_SERVER_IP}${path}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 detik timeout
    
    const imageRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        // Penting: Set Host header ke domain asli
        "Host": "penasakti.com",
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (!imageRes.ok) {
      console.error(`Failed to fetch ${imageUrl}: ${imageRes.status} ${imageRes.statusText}`);
      
      // Fallback: return placeholder image
      return new NextResponse(null, { 
        status: 302,
        headers: {
          "Location": "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found"
        }
      });
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error.message);
    
    // Return placeholder on error
    return new NextResponse(null, { 
      status: 302,
      headers: {
        "Location": "https://placehold.co/600x400/e0e0e0/666666?text=Loading+Error"
      }
    });
  }
}
