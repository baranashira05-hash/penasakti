"use client";

import { useEffect } from "react";

/**
 * ImageProtection
 *
 * Proteksi gambar artikel dari:
 * - Save image (klik kanan → Save Image As)
 * - Drag image
 * - Long press on mobile
 *
 * Cara kerja:
 * - Menambahkan overlay transparan di atas gambar
 * - Disable pointer-events pada <img> di dalam artikel
 * - CSS user-drag: none
 *
 * Dipakai sebagai wrapper global, aktif di seluruh halaman.
 */
export default function ImageProtection() {
  useEffect(() => {
    // Tambahkan CSS global untuk proteksi gambar di artikel
    const style = document.createElement("style");
    style.id = "img-protection-styles";
    style.textContent = `
      /* Proteksi gambar di dalam artikel */
      .article-content img,
      .content-protected img,
      figure img {
        -webkit-user-drag: none;
        user-drag: none;
        -webkit-touch-callout: none;
        pointer-events: none;
      }

      /* Overlay di atas gambar untuk mencegah right-click */
      .content-protected figure,
      .content-protected .article-image-wrapper {
        position: relative;
      }
      .content-protected figure::after,
      .content-protected .article-image-wrapper::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background: transparent;
      }

      /* Disable text selection pada artikel */
      .content-protected .article-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      /* Tapi izinkan select di input/textarea di dalam artikel (jika ada) */
      .content-protected input,
      .content-protected textarea,
      .content-protected [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }

      /* Print protection — artikel di-hide saat print */
      @media print {
        .content-protected .article-content {
          display: none !important;
        }
        .content-protected::after {
          content: 'Konten dilindungi hak cipta. Kunjungi www.penasakti.com untuk membaca artikel ini.';
          display: block;
          font-size: 18px;
          text-align: center;
          padding: 60px 20px;
          color: #333;
        }
      }
    `;

    // Hindari duplikasi
    if (!document.getElementById("img-protection-styles")) {
      document.head.appendChild(style);
    }

    return () => {
      const existing = document.getElementById("img-protection-styles");
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
