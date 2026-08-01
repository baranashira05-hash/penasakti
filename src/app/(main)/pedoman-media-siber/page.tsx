import { Metadata } from "next";
import { Shield, FileCheck, AlertTriangle, Scale, BookOpen, Users, PenTool, Gavel } from "lucide-react";

export const metadata: Metadata = {
  title: "Pedoman Media Siber",
  description: "Pedoman Media Siber PenaSakti yang merujuk pada Undang-Undang Informasi dan Transaksi Elektronik (ITE) serta ketentuan Dewan Pers.",
};

export default function PedomanMediaSiberPage() {
  const sections = [
    {
      icon: BookOpen,
      title: "Pendahuluan",
      content: `Pedoman Media Siber ini disusun sebagai acuan bagi seluruh jajaran redaksi PenaSakti dalam melaksanakan kegiatan jurnalistik di media siber. Pedoman ini berlandaskan pada Undang-Undang Nomor 40 Tahun 1999 tentang Pers, Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (ITE) sebagaimana telah diubah dengan Undang-Undang Nomor 19 Tahun 2016, serta Kode Etik Jurnalistik dan Pedoman Pemberitaan Media Siber yang dikeluarkan oleh Dewan Pers.

PenaSakti berkomitmen untuk menyajikan informasi yang akurat, berimbang, dan bertanggung jawab, serta menghormati hak-hak masyarakat dalam memperoleh informasi yang benar.`,
    },
    {
      icon: Users,
      title: "Prinsip Dasar",
      bullets: [
        "Berita yang disajikan harus benar, akurat, dan dapat dipertanggungjawabkan",
        "Menghormati keberagaman suku, agama, ras, antargolongan, dan keyakinan",
        "Tidak menyebarkan informasi yang menyesatkan, hoaks, atau fitnah",
        "Memberikan hak jawab yang proporsional bagi pihak yang diberitakan",
        "Menjaga independensi dan bebas dari kepentingan pihak manapun",
        "Melindungi sumber berita sesuai ketentuan hukum yang berlaku",
      ],
    },
    {
      icon: PenTool,
      title: "Pedoman Pemberitaan",
      bullets: [
        "Setiap berita harus melalui proses verifikasi data dan fakta yang ketat",
        "Mencantumkan sumber berita yang jelas dan dapat dipercaya",
        "Menghindari pemberitaan yang bersifat prasangka, diskriminatif, atau menghasut",
        "Tidak memberitakan identitas korban kejahatan seksual dan anak-anak",
        "Menyeimbangkan pemberitaan dengan memberikan ruang bagi semua pihak",
        "Mencabut atau melakukan koreksi atas berita yang ditemukan kesalahan",
      ],
    },
    {
      icon: Gavel,
      title: "Batasan Konten",
      bullets: [
        "Tidak menyajikan konten yang melanggar kesusilaan dan ketertiban umum",
        "Tidak menyajikan konten yang memicu kebencian atau permusuhan antar kelompok",
        "Tidak menyajikan konten yang membahayakan keamanan negara dan integrasi bangsa",
        "Tidak menyajikan instruksi atau panduan untuk melakukan tindak kriminal",
        "Tidak menyajikan konten yang melanggar hak cipta dan hak kekayaan intelektual",
        "Tidak menyajikan konten yang mengandung unsur SARA secara berlebihan",
      ],
    },
    {
      icon: Scale,
      title: "Hak Jawab & Koreksi",
      content: `Setiap pihak yang merasa dirugikan oleh pemberitaan PenaSakti berhak mengajukan hak jawab dan koreksi. Pengajuan dapat disampaikan melalui email ke koreksi@penasakti.com dengan melampirkan bukti-bukti yang relevan.

Kami akan memproses setiap pengajuan hak jawab dan koreksi dalam waktu paling lambat 3x24 jam kerja. Jika pengajuan dinyatakan valid, kami akan menerbitkan koreksi, klarifikasi, atau pencabutan berita sesuai dengan ketentuan yang berlaku.`,
    },
    {
      icon: Shield,
      title: "Perlindungan Data Pengguna",
      content: `PenaSakti berkomitmen untuk melindungi data dan privasi pengguna sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi. Data pribadi pengguna tidak akan disebarluaskan kepada pihak ketiga tanpa izin, kecuali untuk keperluan penegakan hukum berdasarkan ketentuan peraturan perundang-undangan yang berlaku.`,
    },
    {
      icon: AlertTriangle,
      title: "Pelanggaran & Sanksi",
      content: `Setiap pelanggaran terhadap pedoman ini oleh jurnalis atau karyawan PenaSakti akan ditindaklanjuti sesuai dengan kebijakan internal dan ketentuan hukum yang berlaku. Sanksi dapat berupa teguran tertulis, sanksi administratif, hingga pemutusan hubungan kerja.

Masyarakat dapat melaporkan dugaan pelanggaran pedoman ini melalui email ke ombudsman@penasakti.com. Kami membentuk Tim Ombudsman Internal yang independen untuk menindaklanjuti setiap laporan yang masuk.`,
    },
    {
      icon: FileCheck,
      title: "Pengesahan",
      content: `Pedoman Media Siber ini ditetapkan di Jakarta, berlaku sejak tanggal 1 Januari 2026 dan dapat dievaluasi sewaktu-waktu sesuai dengan perkembangan hukum dan kebutuhan organisasi.

Pemimpin Redaksi PenaSakti
Ugastra, MB, SH`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-penasakti-red/10 text-penasakti-red rounded-full text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            Sesuai UU ITE & Dewan Pers
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Pedoman <span className="text-penasakti-blue">Media Siber</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acuan bagi seluruh jajaran redaksi PenaSakti dalam menyajikan informasi
            yang bertanggung jawab dan sesuai dengan ketentuan peraturan perundang-undangan.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {sections.map(({ icon: Icon, title, content, bullets }) => (
            <section
              key={title}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-penasakti-blue/10 text-penasakti-blue flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold mb-3">{title}</h2>
                  {content && (
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                      {content}
                    </div>
                  )}
                  {bullets && bullets.length > 0 && (
                    <ul className="space-y-2">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-penasakti-blue mt-2 flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
