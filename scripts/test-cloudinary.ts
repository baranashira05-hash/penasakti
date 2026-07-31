import { v2 as cloudinary } from "cloudinary";
import * as http from "http";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key   :", process.env.CLOUDINARY_API_KEY);

  // Test ping
  try {
    const ping = await cloudinary.api.ping();
    console.log("✅ Cloudinary ping OK:", JSON.stringify(ping));
  } catch (e: any) {
    console.log("❌ Ping gagal:", e.message);
    return;
  }

  // Test upload gambar dari WP via IP (download buffer dulu)
  const testUrl = "http://101.50.1.121/wp-content/uploads/2026/01/IMG-20260107-WA0006.jpg";
  console.log("\n🖼️  Test download gambar dari WP via IP...");
  try {
    // Pakai http module Node.js dengan Host header override
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const req = http.request({
        hostname: "101.50.1.121",
        port: 80,
        path: "/wp-content/uploads/2026/01/IMG-20260107-WA0006.jpg",
        method: "GET",
        headers: {
          "Host": "penasakti.com",
          "User-Agent": "Mozilla/5.0 (compatible; PenaSakti-Migrator/2.0)",
          "Referer": "https://penasakti.com/",
        },
      }, (res) => {
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      });
      req.on("error", reject);
      req.end();
    });
    console.log(`✅ Download OK - ${buffer.length} bytes`);

    console.log("☁️  Upload ke Cloudinary...");
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: "test-wp-import", folder: "penasakti/wp-import", overwrite: true },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(buffer);
    });
    console.log("✅ Upload berhasil!");
    console.log("   URL:", result.secure_url);
    await cloudinary.uploader.destroy("penasakti/wp-import/test-wp-import");
    console.log("🧹 Test file dihapus - semua siap untuk import!");
  } catch (e: any) {
    console.log("❌ Gagal:", e.message);
  }
}

main().catch(console.error);
