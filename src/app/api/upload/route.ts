import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Format tidak didukung. Gunakan JPG, PNG, GIF, WebP, MP4, WebM." }, { status: 400 });
    }

    // Max 5MB for base64 approach
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    // Convert to base64 data URL - works everywhere without external storage
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      data: { url: dataUrl, filename: file.name, size: file.size, type: file.type },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload gagal" }, { status: 500 });
  }
}
