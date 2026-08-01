import Link from "next/link";
import { Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";
import FooterNewsletterForm from "@/components/layout/FooterNewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16 pb-16 lg:pb-0">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">
              Dapatkan Berita Terkini Langsung di Inbox Anda
            </h3>
            <p className="text-white/60 mb-6">
              Daftar newsletter PenaSakti dan jangan lewatkan satu berita pun
            </p>
            <FooterNewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo-penasakti.png"
                alt="PenaSakti"
                className="h-10 w-auto max-w-[160px] object-contain brightness-110 contrast-110"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Portal berita nasional terpercaya yang menyajikan informasi
              terkini, akurat, dan berimbang seputar Indonesia dan dunia.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                {
                  href: "https://www.tiktok.com/@penasakti.com",
                  label: "TikTok",
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                    </svg>
                  ),
                },
                {
                  href: "https://www.youtube.com/@mediapenasaktinews",
                  label: "YouTube",
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  ),
                },
              ].map(({ href, label, svg, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  {Icon ? <Icon className="w-4 h-4" /> : svg}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Kategori</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors hover:pl-1"
                  >
                    → {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Konten Khusus</h4>
            <ul className="space-y-2">
              {[
                { label: "Video Berita", href: "/video" },
                { label: "Foto Jurnalistik", href: "/foto" },
                { label: "Infografis", href: "/infografis" },
                { label: "Podcast", href: "/podcast" },
                { label: "Live TV", href: "/live" },
                { label: "Web Stories", href: "/stories" },
                { label: "Kalender Event", href: "/events" },
                { label: "Polling", href: "/polling" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white text-sm transition-colors hover:pl-1"
                  >
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Informasi</h4>
            <ul className="space-y-2">
              {[
                { label: "Tentang Kami", href: "/tentang-kami" },
                { label: "Redaksi", href: "/redaksi" },
                { label: "Hubungi Kami", href: "/kontak" },
                { label: "Pedoman Media Siber", href: "/pedoman-media-siber" },
                { label: "Kode Etik Jurnalistik", href: "/kode-etik" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Sitemap", href: "/sitemap.xml" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white text-sm transition-colors hover:pl-1"
                  >
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a
                href="mailto:redaksi@penasakti.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                redaksi@penasakti.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile: semua dalam satu blok rapat */}
          <div className="flex flex-col items-center gap-1.5 md:hidden text-center">
            <p className="text-xs text-white/40">© {year} PenaSakti. Hak Cipta Dilindungi.</p>
            <p className="text-xs text-white/40">PT PenaSakti Media Digital</p>
            <p className="text-xs text-white/40">
              Website by{" "}
              <a
                href="https://nufanas.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
              >
                nufanas.com
              </a>
            </p>
          </div>
          {/* Desktop: satu baris */}
          <div className="hidden md:flex flex-row items-center justify-between gap-3 text-sm text-white/40">
            <p>© {year} PenaSakti. Hak Cipta Dilindungi.</p>
            <p>PT PenaSakti Media Digital</p>
            <p>
              Website by{" "}
              <a
                href="https://nufanas.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
              >
                nufanas.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
