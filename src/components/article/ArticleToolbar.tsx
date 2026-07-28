"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Minus, Plus, Type, BookMarked, Heart, Bookmark, Share, Printer, Flag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ArticleToolbarProps {
  title: string;
  text: string;
  onFontSizeChange?: (size: "sm" | "md" | "lg" | "xl") => void;
  onFontSize?: "sm" | "md" | "lg" | "xl";
}

type FontSize = "sm" | "md" | "lg" | "xl";

const FONT_CLASSES: Record<FontSize, string> = {
  sm: "text-sm leading-relaxed",
  md: "text-[1rem] leading-relaxed",
  lg: "text-lg leading-loose",
  xl: "text-xl leading-loose",
};

export function getFontClass(size: FontSize = "md") {
  return FONT_CLASSES[size];
}

export default function ArticleToolbar({ title, text }: ArticleToolbarProps) {
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ps_article_font") : null;
    if (saved && ["sm", "md", "lg", "xl"].includes(saved)) {
      setFontSize(saved as FontSize);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--article-font-size", fontSize);
    const root = document.querySelector<HTMLElement>(".article-content");
    if (root) {
      root.classList.remove("ps-fs-sm", "ps-fs-md", "ps-fs-lg", "ps-fs-xl");
      root.classList.add(`ps-fs-${fontSize}`);
    }
    try {
      localStorage.setItem("ps_article_font", fontSize);
    } catch {}
  }, [fontSize]);

  const stepFont = (dir: -1 | 1) => {
    const order: FontSize[] = ["sm", "md", "lg", "xl"];
    const idx = order.indexOf(fontSize);
    const next = order[Math.max(0, Math.min(3, idx + dir))];
    setFontSize(next);
    toast.message(`Ukuran teks: ${next.toUpperCase()}`, { duration: 1200 });
  };

  const speak = async () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Browser Anda tidak mendukung Text-to-Speech");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechProgress(0);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/<[^>]+>/g, "").slice(0, 4000);
    const utter = new SpeechSynthesisUtterance(`${title}. ${cleanText}`);
    utter.lang = "id-ID";
    utter.rate = 0.95;
    utter.pitch = 1;

    try {
      const voices = window.speechSynthesis.getVoices();
      const idVoice =
        voices.find((v) => /id|indonesia|in-id/i.test(v.lang + " " + v.name)) ||
        voices.find((v) => /male|woman|google/i.test(v.name)) ||
        voices[0];
      if (idVoice) utter.voice = idVoice;
    } catch {}

    utter.onstart = () => {
      setIsSpeaking(true);
      setSpeechProgress(0);
    };
    utter.onend = () => {
      setIsSpeaking(false);
      setSpeechProgress(100);
      setTimeout(() => setSpeechProgress(0), 600);
    };
    utter.onerror = () => {
      setIsSpeaking(false);
      setSpeechProgress(0);
    };
    utter.onboundary = (e) => {
      if (cleanText.length > 0) {
        setSpeechProgress(Math.min(99, Math.round((e.charIndex / cleanText.length) * 100)));
      }
    };

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const handleShare = async () => {
    const shareData = {
      title,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link disalin ke clipboard");
      }
    } catch {}
  };

  const handlePrint = () => window.print();

  const handleLike = () => {
    setLiked((v) => !v);
    toast.message(liked ? "Dihapus dari favorit" : "Ditambahkan ke favorit 💖", { duration: 1400 });
  };

  const handleBookmark = () => {
    setBookmarked((v) => !v);
    toast.success(bookmarked ? "Dihapus dari Bookmark" : "Disimpan ke Bookmark");
  };

  return (
    <div className="sticky top-[70px] z-40 -mx-4 md:-mx-0 mb-5 md:mb-6">
      <div className="bg-background/90 md:bg-card/80 backdrop-blur-md border border-border md:rounded-2xl shadow-sm md:shadow-card p-2.5 md:p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Font Size Group */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/70 border border-border/60">
            <Type className="w-3.5 h-3.5 text-muted-foreground ml-1.5 hidden sm:block" />
            <button
              onClick={() => stepFont(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-40"
              disabled={fontSize === "sm"}
              aria-label="Perkecil teks"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-end gap-0.5 h-8 px-1">
              <span
                className={cn(
                  "w-1 rounded-t bg-foreground/40 transition-all",
                  fontSize === "sm" && "bg-penasakti-blue h-3",
                  fontSize !== "sm" && "h-2"
                )}
              />
              <span
                className={cn(
                  "w-1 rounded-t bg-foreground/40 transition-all",
                  fontSize === "md" && "bg-penasakti-blue h-4",
                  fontSize !== "md" && "h-3"
                )}
              />
              <span
                className={cn(
                  "w-1 rounded-t bg-foreground/40 transition-all",
                  fontSize === "lg" && "bg-penasakti-blue h-5",
                  fontSize !== "lg" && "h-4"
                )}
              />
              <span
                className={cn(
                  "w-1 rounded-t bg-foreground/40 transition-all",
                  fontSize === "xl" && "bg-penasakti-blue h-6",
                  fontSize !== "xl" && "h-5"
                )}
              />
            </div>
            <button
              onClick={() => stepFont(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-40"
              disabled={fontSize === "xl"}
              aria-label="Perbesar teks"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TTS Button */}
          <button
            onClick={speak}
            className={cn(
              "group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all overflow-hidden",
              isSpeaking
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
            )}
          >
            {isSpeaking && speechProgress > 0 && (
              <span
                className="absolute left-0 bottom-0 h-0.5 bg-white/60 transition-all"
                style={{ width: `${speechProgress}%` }}
              />
            )}
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Berhenti</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Dengarkan</span>
                <span className="sm:hidden">Audio</span>
              </>
            )}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0">
            <button
              onClick={handleLike}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
                liked
                  ? "bg-penasakti-red/10 text-penasakti-red hover:bg-penasakti-red/20"
                  : "hover:bg-muted/70 text-muted-foreground"
              )}
              aria-label="Sukai artikel"
            >
              <Heart className={cn("w-4 h-4", liked && "fill-penasakti-red")} />
            </button>
            <button
              onClick={handleBookmark}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
                bookmarked
                  ? "bg-penasakti-blue/10 text-penasakti-blue hover:bg-penasakti-blue/20"
                  : "hover:bg-muted/70 text-muted-foreground"
              )}
              aria-label="Bookmark artikel"
            >
              <Bookmark className={cn("w-4 h-4", bookmarked && "fill-penasakti-blue")} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted/70 text-muted-foreground transition-all"
              aria-label="Bagikan artikel"
            >
              <Share className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted/70 text-muted-foreground transition-all hidden xs:flex"
              aria-label="Cetak artikel"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.message("Laporan terkirim. Tim kami akan memeriksa.", { duration: 1600 })}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted/70 text-muted-foreground transition-all hidden sm:flex"
              aria-label="Laporkan"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ps-fs-sm .article-content { font-size: 0.95rem; line-height: 1.75; }
        .ps-fs-md .article-content { font-size: 1.125rem; line-height: 1.8; }
        .ps-fs-lg .article-content { font-size: 1.25rem; line-height: 1.9; }
        .ps-fs-xl .article-content { font-size: 1.4rem; line-height: 2; }
        .ps-fs-sm .article-content h2 { font-size: 1.4rem; }
        .ps-fs-md .article-content h2 { font-size: 1.5rem; }
        .ps-fs-lg .article-content h2 { font-size: 1.75rem; }
        .ps-fs-xl .article-content h2 { font-size: 2rem; }
      `}</style>
    </div>
  );
}
