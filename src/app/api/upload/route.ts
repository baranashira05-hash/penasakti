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
    // Resize jika terlalu besar (max 1920px width) + convert ke WebP + kompresi
    const qualityNum = Math.min(100, Math.max(10, parseInt(quality) || 80));

    let compressed = await sharp(inputBuffer)
      .resize({
        width: 1920,
        height: 1080,
        fit: "inside",          // Tidak crop, hanya resize jika lebih besar
        withoutEnlargement: true, // Jangan perbesar gambar kecil
      })
      .webp({ quality: qualityNum }) // Convert ke WebP dengan kualitas yang dipilih
      .toBuffer();

    const compressedSize = compressed.length;
    const savingsPercent = Math.round((1 - compressedSize / originalSize) * 100);

    // Upload ke Cloudinary sebagai WebP
    const base64 = `data:image/webp;base64,${compressed.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "penasakti/articles",
      resource_type: "image",
      format: "webp",
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
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
