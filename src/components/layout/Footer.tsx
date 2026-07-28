import Link from "next/link";
import { Rss, Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16">
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
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                Daftar
              </button>
            </form>
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
                className="h-10 w-auto brightness-110 contrast-110"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Portal berita nasional terpercaya yang menyajikan informasi
              terkini, akurat, dan berimbang seputar Indonesia dan dunia.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: null, href: "#", label: "Facebook", emoji: "f" },
                { icon: null, href: "#", label: "Twitter/X", emoji: "𝕏" },
                { icon: null, href: "#", label: "Instagram", emoji: "ig" },
                { icon: null, href: "#", label: "Youtube", emoji: "▶" },
                { icon: Rss, href: "/rss.xml", label: "RSS" },
              ].map(({ icon: Icon, href, label, emoji }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  {Icon ? <Icon className="w-4 h-4" /> : <span className="text-xs font-bold">{emoji}</span>}
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
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/40">
            <p>© {year} PenaSakti. Hak Cipta Dilindungi.</p>
            <p>
              PT PenaSakti Media Digital | AHU-XXXXXXX | Anggota Dewan Pers
            </p>
            <p>
              Dibuat dengan ❤️ di Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
