import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const quality = formData.get("quality") as string || "80"; // 1-100, default 80
    const altText = formData.get("alt") as string || ""; // SEO alt text

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Format tidak didukung. Gunakan JPG, PNG, GIF, WebP." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 10MB" },
        { status: 400 }
      );
    }

    // Konversi File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const originalSize = inputBuffer.length;

    // ── Kompresi menggunakan Sharp ──────────────────────────────────
    const qualityNum = Math.min(100, Math.max(10, parseInt(quality) || 80));

    // Get metadata for SEO (width/height)
    const metadata = await sharp(inputBuffer).metadata();

    let compressed = await sharp(inputBuffer)
      .resize({
        width: 1920,
        height: 1080,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: qualityNum })
      .toBuffer();

    // Get final dimensions
    const finalMeta = await sharp(compressed).metadata();
    const compressedSize = compressed.length;
    const savingsPercent = Math.round((1 - compressedSize / originalSize) * 100);

    // ── SEO: Generate descriptive public_id dari filename ────────────
    // Cloudinary public_id menjadi bagian dari URL → penting untuk SEO gambar
    const originalName = file.name
      .replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, "")
      .replace(/[^a-zA-Z0-9-_\s]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()
      .substring(0, 60);
    const timestamp = Date.now().toString(36);
    const seoPublicId = `${originalName}-${timestamp}`;

    // Upload ke Cloudinary dengan metadata SEO
    const base64 = `data:image/webp;base64,${compressed.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "penasakti/articles",
      resource_type: "image",
      format: "webp",
      public_id: seoPublicId,
      // Cloudinary context metadata untuk SEO
      context: {
        alt: altText || originalName.replace(/-/g, " "),
        caption: altText || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: finalMeta.width || metadata.width || 1200,
        height: finalMeta.height || metadata.height || 630,
        alt: altText || originalName.replace(/-/g, " "),
        originalSize: `${(originalSize / 1024).toFixed(0)}KB`,
        compressedSize: `${(compressedSize / 1024).toFixed(0)}KB`,
        savings: `${savingsPercent}%`,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Upload gagal";
    console.error("[API/UPLOAD]", error);
    return NextResponse.json({ success: false, error: "Upload gagal: " + msg }, { status: 500 });
  }
}
