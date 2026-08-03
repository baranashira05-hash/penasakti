"use client";

/**
 * InvisibleWatermark
 *
 * Sisipkan watermark tersembunyi pada konten artikel.
 * Watermark ini tidak terlihat oleh pembaca, tapi akan ikut ter-copy
 * jika seseorang mencoba menyalin konten.
 *
 * Cara kerja:
 * - Menyisipkan karakter Unicode zero-width yang mengandung encoded URL
 * - Menambahkan hidden span dengan source attribution
 * - Tidak mengganggu tampilan atau SEO
 */

interface InvisibleWatermarkProps {
  articleUrl: string;
  articleId?: string;
}

/**
 * Encode string ke zero-width characters.
 * Setiap karakter di-encode ke kombinasi:
 * - U+200B (zero-width space)
 * - U+200C (zero-width non-joiner)
 * - U+200D (zero-width joiner)
 * - U+FEFF (zero-width no-break space)
 */
function encodeToZeroWidth(text: string): string {
  const chars = ["\u200B", "\u200C", "\u200D", "\uFEFF"];
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // Encode ke base-4 menggunakan zero-width chars
      let encoded = "";
      let n = code;
      for (let i = 0; i < 4; i++) {
        encoded = chars[n % 4] + encoded;
        n = Math.floor(n / 4);
      }
      return encoded;
    })
    .join(chars[0]); // separator antar karakter
}

export default function InvisibleWatermark({ articleUrl, articleId }: InvisibleWatermarkProps) {
  // Encode source info ke zero-width characters
  const watermarkData = `©PS:${articleUrl}`;
  const encoded = encodeToZeroWidth(watermarkData.substring(0, 30)); // Batasi panjang

  return (
    <>
      {/* Zero-width watermark — invisible tapi ikut ter-copy */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
          fontSize: 0,
          lineHeight: 0,
        }}
        data-wm={articleId}
      >
        {encoded}
      </span>

      {/* Hidden attribution — muncul saat copy-paste ke rich text editor */}
      <span
        aria-hidden="true"
        className="invisible-watermark"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
        }}
      >
        Sumber: {articleUrl} — © PenaSakti Media Digital
      </span>
    </>
  );
}
