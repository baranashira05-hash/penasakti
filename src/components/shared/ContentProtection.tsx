"use client";

import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

/**
 * ContentProtection
 *
 * Proteksi konten artikel dari:
 * - Copy/Paste/Cut/Select All/Save/Print (Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+S, Ctrl+P)
 * - Right-click context menu
 * - Text selection pada area artikel
 * - Drag and drop text
 * - DevTools detection (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 * - Image save/drag
 *
 * SEO SAFE: Tidak memblokir bot/crawler. Proteksi hanya di client-side JavaScript,
 * sehingga Googlebot (yang tidak menjalankan JS proteksi ini) tetap bisa crawl konten.
 *
 * IMPORTANT: Ini bukan proteksi 100% (determined users bisa bypass).
 * Tujuannya adalah mencegah copy-paste kasual oleh user biasa.
 */

const COPYRIGHT_NOTICE = "Konten PenaSakti.com dilindungi hak cipta. © PenaSakti Media Digital";
const SITE_URL = "https://www.penasakti.com";

interface ContentProtectionProps {
  /** Apakah proteksi aktif (misal nonaktifkan di dashboard) */
  enabled?: boolean;
  /** URL artikel untuk watermark pada clipboard */
  articleUrl?: string;
  /** Judul artikel */
  articleTitle?: string;
  children: React.ReactNode;
}

export default function ContentProtection({
  enabled = true,
  articleUrl,
  articleTitle,
  children,
}: ContentProtectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const devToolsOpen = useRef(false);

  const showNotice = useCallback(() => {
    toast.error("Konten PenaSakti.com dilindungi hak cipta.", {
      id: "content-protection",
      duration: 3000,
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // ── Blokir keyboard shortcuts ────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+S, Ctrl+P
      if (ctrl && ["c", "a", "x", "s", "p"].includes(e.key.toLowerCase())) {
        // Izinkan di input/textarea (form fields)
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        showNotice();
        return;
      }

      // F12
      if (e.key === "F12") {
        e.preventDefault();
        showNotice();
        return;
      }

      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
      if (ctrl && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        showNotice();
        return;
      }

      // Ctrl+U (View Source)
      if (ctrl && e.key.toLowerCase() === "u") {
        e.preventDefault();
        showNotice();
        return;
      }
    };

    // ── Blokir context menu (klik kanan) ─────────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Izinkan di input/textarea
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
      showNotice();
    };

    // ── Blokir copy event — sisipkan source URL ──────────────────────
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const selection = window.getSelection()?.toString() || "";

      if (selection.length > 0) {
        // Sisipkan source URL pada konten yang dicopy
        const watermarkedText = `${selection}\n\n—\nSumber: ${articleTitle || "PenaSakti.com"}\n${articleUrl || SITE_URL}\n© PenaSakti Media Digital. Seluruh konten dilindungi hak cipta.`;
        e.clipboardData?.setData("text/plain", watermarkedText);
        e.clipboardData?.setData(
          "text/html",
          `${selection}<br><br><small style="color:#666">Sumber: <a href="${articleUrl || SITE_URL}">${articleTitle || "PenaSakti.com"}</a> — © PenaSakti Media Digital</small>`
        );
        e.preventDefault();
        showNotice();
      } else {
        e.preventDefault();
        showNotice();
      }
    };

    // ── Blokir cut ───────────────────────────────────────────────────
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
      showNotice();
    };

    // ── Blokir drag ──────────────────────────────────────────────────
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      // Blokir drag text dan image
      if (target.tagName === "IMG" || window.getSelection()?.toString()) {
        e.preventDefault();
        showNotice();
      }
    };

    // ── Blokir select ────────────────────────────────────────────────
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Izinkan select di form fields
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      // Cek apakah target ada di dalam container proteksi (artikel)
      if (containerRef.current?.contains(target)) {
        e.preventDefault();
      }
    };

    // ── DevTools detection (basic) ───────────────────────────────────
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devToolsOpen.current) {
          devToolsOpen.current = true;
          console.clear();
          console.log(
            "%c⚠️ PERHATIAN",
            "color: red; font-size: 40px; font-weight: bold;"
          );
          console.log(
            "%cKonten PenaSakti.com dilindungi hak cipta.\nPenyalinan tanpa izin melanggar UU Hak Cipta.",
            "color: #333; font-size: 16px;"
          );
        }
      } else {
        devToolsOpen.current = false;
      }
    };

    // ── Blokir print ─────────────────────────────────────────────────
    const handleBeforePrint = () => {
      showNotice();
    };

    // Register event listeners
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCut, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("selectstart", handleSelectStart, true);
    window.addEventListener("beforeprint", handleBeforePrint);

    // DevTools detection interval
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCut, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
      clearInterval(devToolsInterval);
    };
  }, [enabled, articleUrl, articleTitle, showNotice]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={containerRef}
      className="content-protected"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
