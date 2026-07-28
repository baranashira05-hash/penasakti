import Link from "next/link";
import Image from "next/image";
import { Flame } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const POPULAR = [
  { id: "1", title: "Syarat dan Cara Daftar BPJS Ketenagakerjaan Online Terbaru", slug: "syarat-daftar-bpjs-ketenagakerjaan", image: "https://picsum.photos/seed/pop1/100/100", views: 312000 as unknown as bigint, category: "Nasional" },
  { id: "2", title: "Biaya Kuliah UI, ITB, UGM, ITS 2026 Jalur Mandiri", slug: "biaya-kuliah-ptn-2026", image: "https://picsum.photos/seed/pop2/100/100", views: 287000 as unknown as bigint, category: "Pendidikan" },
  { id: "3", title: "Cara Top Up Saldo GoPay, OVO, Dana dari Bank BRI", slug: "cara-top-up-gopay-ovo-dana", image: "https://picsum.photos/seed/pop3/100/100", views: 256000 as unknown as bigint, category: "Teknologi" },
  { id: "4", title: "Lokasi SIM Keliling Jakarta Hari Ini dan Besok", slug: "lokasi-sim-keliling-jakarta", image: "https://picsum.photos/seed/pop4/100/100", views: 234000 as unknown as bigint, category: "Daerah" },
  { id: "5", title: "Cara Cek Saldo BPJS Ketenagakerjaan Lewat HP", slug: "cara-cek-saldo-bpjs", image: "https://picsum.photos/seed/pop5/100/100", views: 198000 as unknown as bigint, category: "Nasional" },
];

export default function PopularArticles() {
  return (
    <section className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-penasakti-red" />
        <h2 className="font-bold text-lg">Terpopuler</h2>
      </div>

      <ol className="space-y-4">
        {POPULAR.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={`flex-shrink-0 text-xl font-black w-7 ${
                index < 3 ? "text-penasakti-red" : "text-muted-foreground/30"
              }`}
            >
              {index + 1}
            </span>
            <Link
              href={`/artikel/${item.slug}`}
              className="group flex gap-3 flex-1 min-w-0"
            >
              <div className="relative w-16 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(item.views)} views
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
