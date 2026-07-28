"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MobileGestures({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [swipeHint, setSwipeHint] = useState<null | "left" | "right">(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const atTop = () =>
    typeof window !== "undefined" ? window.scrollY <= 2 : true;

  const showHint = (side: "left" | "right") => {
    setSwipeHint(side);
    setTimeout(() => setSwipeHint(null), 900);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;

      if (atTop() && dy > 0 && Math.abs(dy) > Math.abs(dx) && dy < 160) {
        setPullDistance(Math.min(120, dy * 0.55));
      }

      if (Math.abs(dx) > 60 && Math.abs(dy) < 80) {
        const targetIndex = Math.floor(Math.random() * CATEGORIES.length);
        if (dx < 0) {
          showHint("left");
        } else {
          showHint("right");
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.time;
      const velocity = Math.sqrt(dx * dx + dy * dy) / (dt || 1);

      if (pullDistance >= 70 && atTop()) {
        setPullDistance(0);
        if (!refreshing) {
          setRefreshing(true);
          toast.message("Memperbarui konten...", { duration: 1000 });
          setTimeout(() => {
            setRefreshing(false);
            toast.custom(
              (id) => (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-xl">
                  <CheckCircle className="w-4 h-4" />
                  Konten diperbarui!
                </div>
              ),
              { duration: 1500 }
            );
            if ("location" in window) {
              // Trigger soft refresh without full page reload on client
              window.dispatchEvent(new CustomEvent("ps-refresh"));
            }
          }, 1100);
        }
        touchStart.current = null;
        return;
      }

      setPullDistance(0);

      if (dt < 500 && velocity > 0.6 && Math.abs(dx) > 90 && Math.abs(dy) < 100) {
        if (dx < 0) {
          const categories = CATEGORIES;
          const currentCat = pathname.split("/kategori/")[1]?.split("/")[0];
          const idx = categories.findIndex((c) => c.slug === currentCat);
          const next = idx >= 0 ? (idx + 1) % categories.length : 0;
          if (pathname.startsWith("/kategori/") || idx >= 0) {
            router.push(`/kategori/${categories[next].slug}`);
          }
        } else {
          if (window.history.length > 1) {
            router.back();
          }
        }
      }

      touchStart.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, router, pullDistance, refreshing]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full min-h-screen touch-manipulation", {
        "pt-0": pullDistance > 0,
      })}
    >
      {/* Pull to refresh indicator */}
      <div
        aria-hidden
        className={cn(
          "sticky top-0 z-[110] flex items-end justify-center transition-all pointer-events-none overflow-hidden",
          {
            "opacity-100": pullDistance > 4 || refreshing,
            "opacity-0": pullDistance <= 4 && !refreshing,
          }
        )}
        style={{ height: refreshing ? 60 : Math.max(0, pullDistance) }}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-1 pb-2",
            refreshing ? "animate-bounce" : ""
          )}
          style={{
            transform: pullDistance >= 70 ? "rotate(0deg)" : `rotate(${(pullDistance / 70) * 360}deg)`,
            transition: refreshing ? "none" : "transform 120ms linear",
          }}
        >
          <RefreshCw
            className={cn(
              "w-5 h-5 transition-colors",
              pullDistance >= 70 || refreshing ? "text-emerald-500" : "text-penasakti-blue"
            )}
          />
          <span className="text-[10px] font-semibold text-muted-foreground">
            {refreshing ? "Menyegarkan..." : pullDistance >= 70 ? "Lepaskan untuk refresh" : "Tarik untuk refresh"}
          </span>
        </div>
      </div>

      {/* Swipe Hint Indicators */}
      {swipeHint && (
        <div className="fixed inset-0 z-[130] pointer-events-none flex items-center justify-center">
          <div
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl bg-background/95 backdrop-blur border border-border shadow-2xl animate-[slideUp_0.3s_ease-out]",
              {
                "flex-row": swipeHint === "left",
                "flex-row-reverse": swipeHint === "right",
              }
            )}
          >
            {swipeHint === "left" ? (
              <>
                <ArrowRight className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold">Kategori Berikutnya</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5 text-penasakti-blue" />
                <span className="text-sm font-semibold">Kembali / Sebelumnya</span>
              </>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
