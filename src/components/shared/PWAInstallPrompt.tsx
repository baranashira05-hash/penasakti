"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, Share, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PWAInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const iosCheck = /iphone|ipad|ipod/.test(ua) && !(ua.includes("crios") || ua.includes("fxios"));
    setIsIOS(iosCheck);

    const hideDismissed = Number(localStorage.getItem("ps_pwa_dismissed") || "0");
    const dismissInterval = 1000 * 60 * 60 * 48;
    if (Date.now() - hideDismissed < dismissInterval) {
      setIsDismissed(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      if (!standalone && !isDismissed) {
        setTimeout(() => setShow(true), 4500);
      }
    };

    const handleAppInstalled = () => {
      setShow(false);
      localStorage.setItem("ps_pwa_installed", "1");
      toast.success("Berhasil terinstall! Selamat menggunakan PenaSakti 🎉", { duration: 3500 });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (iosCheck && !standalone && !isDismissed) {
      setTimeout(() => setShow(true), 5500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isDismissed]);

  const handleInstall = async () => {
    if (isIOS) {
      toast.message(
        "Untuk install: Tekan tombol Share → 'Add to Home Screen'",
        {
          duration: 5000,
          description: "Ikuti langkah sederhana untuk menikmati PWA mode",
        }
      );
      return;
    }

    if (!deferredEvent) {
      toast.info("Install PenaSakti dari menu browser Anda");
      return;
    }

    try {
      await deferredEvent.prompt();
      const choice = await deferredEvent.userChoice;
      if (choice.outcome === "accepted") {
        setShow(false);
      }
    } catch {
      toast.info("Silakan buka menu browser untuk install aplikasi");
    } finally {
      setDeferredEvent(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("ps_pwa_dismissed", String(Date.now()));
    setIsDismissed(true);
  };

  if (!show || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="fixed bottom-[72px] sm:bottom-4 left-0 right-0 sm:left-4 sm:right-auto sm:max-w-sm z-[120] px-3 sm:px-0"
      >
        <div className="relative bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-4 pr-10">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-penasakti-blue to-penasakti-red text-white flex items-center justify-center font-black text-xl shadow-lg flex-shrink-0">
                P
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base leading-snug mb-0.5">
                  Install PenaSakti
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Akses lebih cepat, hemat kuota, baca offline, dan notifikasi push berita penting.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { icon: Smartphone, label: "Layar Penuh", color: "text-blue-500" },
                { icon: Download, label: "Offline Mode", color: "text-emerald-500" },
                { icon: Star, label: "Hemat Kuota", color: "text-amber-500" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/40">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-penasakti-blue text-white text-sm font-bold rounded-xl hover:bg-penasakti-blue/90 transition-colors shadow-md shadow-penasakti-blue/20"
              >
                <Download className="w-4 h-4" />
                {isIOS ? (
                  <>
                    <Share className="w-3.5 h-3.5 -ml-1" />
                    Cara Install iOS
                  </>
                ) : (
                  <>Install Sekarang</>
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
