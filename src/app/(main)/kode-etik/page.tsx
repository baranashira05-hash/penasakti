import { Metadata } from "next";
import { Award, BookOpen, Scale, Users, Shield, PenTool, Heart, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Kode Etik Jurnalistik",
  description: "Kode Etik Jurnalistik PenaSakti yang menjadi pedoman moral bagi seluruh jurnalis dan redaksi dalam menjalankan tugas jurnalistik.",
};

export default function KodeEtikPage() {
  const principles = [
    {
      icon: Target,
      number: "Pertama",
      title: "Kepentingan Umum di Atas Segalanya",
      description:
        "Jurnalis PenaSakti senantiasa mengutamakan kepentingan umum di atas kepentingan pribadi, golongan, atau pihak manapun dalam melaksanakan tugas jurnalistik.",
    },
    {
      icon: Shield,
      number: "Kedua",
      title: "Profesional dan Independen",
      description:
        "Melaksanakan tugas dengan cara-cara yang profesional dan menjaga independensi serta bebas dari pengaruh, tekanan, atau intervensi dari pihak manapun.",
    },
    {
      icon: BookOpen,
      number: "Ketiga",
      title: "Akurasi dan Kebenaran",
      description:
        "Berita yang disajikan harus benar, akurat, dan berdasarkan fakta yang dapat dipertanggungjawabkan. Setiap informasi harus diverifikasi sebelum dipublikasikan.",
    },
    {
      icon: Scale,
      number: "Keempat",
      title: "Berimbang dan Adil",
      description:
        "Memberikan kesempatan yang sama kepada pihak-pihak yang terkait dalam pemberitaan untuk memberikan penjelasan dan pendapatnya secara proporsional.",
    },
    {
      icon: Users,
      number: "Kelima",
      title: "Hak Jawab dan Koreksi",
      description:
        "Memberikan hak jawab kepada setiap pihak yang merasa dirugikan dan bersedia melakukan koreksi atau klarifikasi terhadap berita yang ditemukan kesalahan.",
    },
    {
      icon: PenTool,
      number: "Keenam",
      title: "Tidak Menyalahgunakan Profesi",
      description:
        "Tidak menerima suap, hadiah, atau imbalan dalam bentuk apapun yang dapat mempengaruhi objektivitas dan independensi pemberitaan.",
    },
    {
      icon: Heart,
      number: "Ketujuh",
      title: "Menghargai Privasi",
      description:
        "Menghormati dan melindungi hak privasi setiap individu, kecuali untuk kepentingan publik yang lebih besar sesuai ketentuan hukum.",
    },
    {
      icon: Award,
      number: "Kedelapan",
      title: "Integritas Moral",
      description:
        "Memiliki integritas moral yang tinggi, jujur, berani mengungkap kebenaran, dan bertanggung jawab terhadap segala akibat dari pemberitaan yang dibuat.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-penasakti-gold/20 text-penasakti-gold rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Kode Etik PWI & Dewan Pers
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Kode Etik <span className="text-penasakti-gold">Jurnalistik</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pedoman moral dan etika yang harus dipatuhi oleh seluruh jurnalis
            dan redaksi PenaSakti dalam menjalankan tugas jurnalistik.
          </p>
        </div>

        {/* Intro */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-penasakti-gold/10 via-transparent to-penasakti-gold/5 border border-border mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-penasakti-gold" />
            Mukadimah
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Kode Etik Jurnalistik ini disusun berdasarkan Kode Etik Jurnalistik
            Persatuan Wartawan Indonesia (PWI) dan Pedoman Perilaku Jurnalis
            yang dikeluarkan oleh Dewan Pers Republik Indonesia. Kode etik ini
            merupakan komitmen moral seluruh insan pers di lingkungan PenaSakti
            untuk melaksanakan profesi jurnalistik dengan penuh tanggung jawab,
            integritas, dan dedikasi terhadap kepentingan masyarakat.
          </p>
        </div>

        {/* Principles */}
        <div className="space-y-4 mb-10">
          {principles.map(({ icon: Icon, number, title, description }) => (
            <div
              key={number}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-penasakti-gold/40 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-5">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-penasakti-gold/10 text-penasakti-gold flex items-center justify-center group-hover:bg-penasakti-gold group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-penasakti-gold uppercase tracking-wider">
                    Pasal {number}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-penasakti-gold transition-colors">
                    {title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sanksi */}
        <section className="p-6 rounded-2xl bg-penasakti-red/5 border border-penasakti-red/20 mb-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-penasakti-red">
            <Shield className="w-5 h-5" />
            Sanksi Pelanggaran
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Setiap pelanggaran terhadap Kode Etik Jurnalistik ini akan ditindaklanjuti
            oleh Dewan Kehormatan Jurnalistik PenaSakti melalui mekanisme pemeriksaan
            yang berkeadilan. Sanksi yang dapat dikenakan meliputi:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { level: "Ringan", sanction: "Teguran lisan atau tertulis" },
              { level: "Sedang", sanction: "Skorsing dari tugas selama 1-14 hari" },
              { level: "Berat", sanction: "Penurunan pangkat atau jabatan" },
              { level: "Paling Berat", sanction: "Pemutusan hubungan kerja" },
            ].map(({ level, sanction }) => (
              <div
                key={level}
                className="p-4 rounded-xl bg-background/50 border border-penasakti-red/10"
              >
                <p className="text-sm font-bold text-penasakti-red mb-1">{level}</p>
                <p className="text-sm text-muted-foreground">{sanction}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center p-6 rounded-2xl bg-card border border-border">
          <p className="text-sm font-semibold mb-1">Pengesahan</p>
          <p className="text-sm text-muted-foreground">
            Kode Etik ini berlaku sejak 1 Januari 2026 dan dapat dievaluasi
            sesuai dengan perkembangan industri pers dan peraturan perundang-undangan.
          </p>
        </div>
      </div>
    </div>
  );
}
