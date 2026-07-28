import { Metadata } from "next";
import Link from "next/link";
import { Shield, Award, Users, Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "PenaSakti adalah portal berita nasional terpercaya yang didirikan dengan visi memberikan informasi akurat, berimbang, dan bertanggung jawab.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Akurasi & Kepercayaan",
      description: "Setiap berita melalui proses verifikasi ketat dan editorial yang independen.",
    },
    {
      icon: Eye,
      title: "Independen",
      description: "Bebas dari pengaruh pihak manapun, kami berkomitmen pada kebenaran informasi.",
    },
    {
      icon: Heart,
      title: "Untuk Rakyat",
      description: "Menjadi suara rakyat dan mengawal demokrasi melalui jurnalisme yang berani.",
    },
    {
      icon: Target,
      title: "Cepat & Tepat",
      description: "Menyajikan berita terkini dengan kecepatan tanpa mengorbankan akurasi.",
    },
  ];

  const team = [
    { name: "Dr. Ahmad Wijaya", role: "Pemimpin Redaksi", image: "https://picsum.photos/seed/editor1/200/200" },
    { name: "Siti Nurhaliza, M.Si.", role: "Wakil Pemimpin Redaksi", image: "https://picsum.photos/seed/editor2/200/200" },
    { name: "Budi Prasetyo", role: "Managing Editor", image: "https://picsum.photos/seed/editor3/200/200" },
    { name: "Dewi Lestari", role: "Head of News Desk", image: "https://picsum.photos/seed/editor4/200/200" },
  ];

  const milestones = [
    { year: "2024", title: "Pendirian PenaSakti", description: "PenaSakti didirikan dengan semangat jurnalisme independen." },
    { year: "2025", title: "Ekspansi Nasional", description: "Memperluas jaringan koresponden ke seluruh 38 provinsi Indonesia." },
    { year: "2026", title: "Era Digital", description: "Peluncuran platform digital modern dengan AI integration." },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-penasakti-blue/10 text-penasakti-blue rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Anggota Dewan Pers
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 font-heading">
            Tentang <span className="text-penasakti-red">PenaSakti</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Portal berita nasional terpercaya yang berkomitmen menyajikan informasi akurat,
            berimbang, dan bertanggung jawab untuk kemajuan bangsa Indonesia.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-penasakti-blue/10 to-transparent border border-border">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Target className="w-6 h-6 text-penasakti-red" />
              Visi Kami
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Menjadi portal berita nasional paling terpercaya, inovatif, dan berdampak
              positif bagi masyarakat Indonesia melalui jurnalisme berkualitas tinggi.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-penasakti-red/10 to-transparent border border-border">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Users className="w-6 h-6 text-penasakti-blue" />
              Misi Kami
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-penasakti-blue">▸</span>
                Menyajikan berita yang akurat, berimbang, dan bertanggung jawab
              </li>
              <li className="flex gap-2">
                <span className="text-penasakti-blue">▸</span>
                Menjadi pengawal demokrasi dan kebebasan pers
              </li>
              <li className="flex gap-2">
                <span className="text-penasakti-blue">▸</span>
                Mengedukasi masyarakat melalui informasi berkualitas
              </li>
              <li className="flex gap-2">
                <span className="text-penasakti-blue">▸</span>
                Mengadopsi teknologi terkini untuk pengalaman terbaik
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Nilai-Nilai Kami</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-5 rounded-xl border border-border hover:border-penasakti-blue/50 hover:shadow-card-hover transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-penasakti-blue/10 flex items-center justify-center mb-3 group-hover:bg-penasakti-blue group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6 text-penasakti-blue group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Jajaran Pemimpin Redaksi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((person) => (
              <div
                key={person.name}
                className="text-center p-5 rounded-xl border border-border hover:shadow-card-hover transition-all"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 ring-2 ring-penasakti-blue/20">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Perjalanan Kami</h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-6">
              {milestones.map((item, i) => (
                <div
                  key={item.year}
                  className={`flex flex-col md:flex-row items-center gap-4 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="md:w-1/2" />
                  <div className="w-12 h-12 rounded-full bg-penasakti-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0 relative z-10">
                    {item.year.slice(2)}
                  </div>
                  <div className="md:w-1/2">
                    <div className="p-5 rounded-xl border border-border bg-card hover:shadow-card-hover transition-all">
                      <span className="text-xs font-bold text-penasakti-red">{item.year}</span>
                      <h3 className="font-bold text-lg mt-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-penasakti-blue to-penasakti-red text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Bergabung Bersama Kami</h2>
          <p className="text-white/80 mb-4">
            Jadilah bagian dari perubahan positif melalui jurnalisme berkualitas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/redaksi"
              className="px-6 py-2.5 bg-white text-penasakti-blue font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Lihat Redaksi
            </Link>
            <Link
              href="/kontak"
              className="px-6 py-2.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
