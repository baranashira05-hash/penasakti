import { NextRequest, NextResponse } from "next/server";

const OLD_SERVER_IP = "161.50.1.21";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path || !path.startsWith("/wp-content/uploads/")) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    // Fetch gambar dari server lama
    const imageUrl = `http://${OLD_SERVER_IP}${path}`;
    const imageRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PenaSakti/1.0)",
        "Host": "www.penasakti.com",
      },
    });

    if (!imageRes.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const imageBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
