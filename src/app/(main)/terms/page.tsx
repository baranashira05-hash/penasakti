import { Metadata } from "next";
import { Gavel, User, AlertTriangle, Shield, Ban, FileWarning, Scale, Clock, Handshake, AlertOctagon, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan Ketentuan penggunaan layanan PenaSakti. Baca sebelum menggunakan layanan kami.",
};

export default function TermsPage() {
  const sections = [
    {
      icon: Handshake,
      title: "1. Penerimaan Syarat",
      content:
        "Dengan mengakses dan menggunakan layanan PenaSakti (penasakti.com), Anda secara tegas menyetujui dan terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian atau seluruhnya, Anda tidak diperkenankan menggunakan layanan kami. Penggunaan layanan secara berkelanjutan dianggap sebagai penerimaan terhadap perubahan yang mungkin dilakukan pada syarat ini.",
    },
    {
      icon: User,
      title: "2. Akun Pengguna",
      bullets: [
        "Anda bertanggung jawab atas kerahasiaan informasi akun dan kata sandi Anda",
        "Memberikan informasi yang akurat, lengkap, dan terkini saat pendaftaran",
        "Tidak diperbolehkan membuat akun atas nama orang lain tanpa izin tertulis",
        "PenaSakti berhak menangguhkan atau menutup akun yang melanggar ketentuan ini",
        "Anda wajib memberitahu kami segera jika terjadi penggunaan akun yang tidak sah",
      ],
    },
    {
      icon: AlertTriangle,
      title: "3. Penggunaan Layanan",
      bullets: [
        "Menggunakan layanan sesuai dengan hukum dan peraturan yang berlaku di Indonesia",
        "Tidak mengunduh, menyalin, memodifikasi, mendistribusikan, atau memperjualbelikan konten PenaSakti tanpa izin tertulis",
        "Tidak menggunakan layanan untuk tujuan ilegal, menyinggung, atau merugikan pihak lain",
        "Tidak mengakses atau mencoba mengakses bagian dari layanan yang tidak terbuka untuk publik",
        "Tidak mengganggu atau merusak keamanan, integritas, dan performa layanan PenaSakti",
        "Tidak menggunakan robot, crawler, scraper, atau alat otomatis serupa tanpa izin eksplisit",
      ],
    },
    {
      icon: Gavel,
      title: "4. Hak Kekayaan Intelektual",
      content:
        "Seluruh konten yang tersedia di PenaSakti termasuk namun tidak terbatas pada artikel, foto, video, grafik, logo, merek dagang, desain, dan perangkat lunak dilindungi oleh undang-undang hak cipta, merek dagang, dan hukum kekayaan intelektual lainnya yang berlaku di Indonesia dan negara-negara lain. Penggunaan konten komersial memerlukan izin tertulis dari pihak PenaSakti. Pengutipan artikel atau penggunaan konten non-komersial diperbolehkan dengan syarat mencantumkan sumber dan tautan kembali ke halaman asli PenaSakti.",
    },
    {
      icon: FileWarning,
      title: "5. Konten Buatan Pengguna (UGC)",
      bullets: [
        "Anda mempertahankan hak atas konten yang Anda kirimkan (komentar, ulasan, masukan)",
        "Dengan mengirimkan konten, Anda memberikan PenaSakti lisensi non-eksklusif, bebas royalti, dan dapat dialihkan untuk menggunakan, memodifikasi, mendistribusikan, dan mempublikasikan konten tersebut",
        "Anda menyatakan dan menjamin bahwa konten Anda tidak melanggar hak pihak ketiga dan tidak melanggar hukum",
        "PenaSakti berhak namun tidak berkewajiban untuk memoderasi, menyaring, atau menghapus konten pengguna yang dianggap tidak pantas",
      ],
    },
    {
      icon: Shield,
      title: "6. Penyangkalan Garansi",
      content:
        "LAYANAN PENASAKTI DIBERIKAN 'SEBAGAIMANA ADANYA' DAN 'SEBAGAIMANA TERSEDIA' TANPA JENIS GARANSI APAPUN, BAIK TERSURAT MAUPUN TERSIRAT. PENASAKTI TIDAK MENJAMIN BAHWA LAYANAN AKAN BEBAS DARI KESALAHAN, TIDAK TERPUTUS, AMAN, ATAU BEBAS DARI VIRUS ATAU KOMPONEN BERBAHAYA LAINNYA. PENASAKTI JUGA TIDAK MENJAMIN KEAKURATAN, KELENGKAPAN, ATAU KEANDALAN KONTEN YANG DISAJIKAN.",
    },
    {
      icon: Scale,
      title: "7. Batasan Tanggung Jawab",
      content:
        "SEJAUH DIIZINKAN OLEH HUKUM YANG BERLAKU, PENASAKTI TIDAK BERTANGGUNG JAWAB ATAS KERUGIAN LANGSUNG, TIDAK LANGSUNG, INSIDENTAL, KHUSUS, KONSEKUENSIAL, ATAU TIDAK TERDUGA SEBAGAI AKIBAT DARI ATAU HUBUNGAN DENGAN PENGGUNAAN LAYANAN, TERMASUK NAMUN TIDAK TERBATAS PADA KERUGIAN PROFIT, DATA, ATAU KEHILANGAN NIAGA BAHKAN JIKA PENASAKTI TELAH DIBERI TAHU KEMUNGKINAN TERSEBUT.",
    },
    {
      icon: Ban,
      title: "8. Penghentian Layanan",
      content:
        "PenaSakti berhak untuk menangguhkan atau menghentikan akses Anda ke seluruh atau sebagian layanan kapan saja, dengan atau tanpa alasan, termasuk namun tidak terbatas pada dugaan pelanggaran Syarat dan Ketentuan ini. Penghentian dapat dilakukan tanpa pemberitahuan sebelumnya. Setelah penghentian, seluruh hak dan kewajiban berdasarkan syarat ini akan tetap berlaku sesuai sifatnya.",
    },
    {
      icon: Clock,
      title: "9. Hukum yang Berlaku",
      content:
        "Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Segala sengketa yang timbul dari atau terkait dengan penggunaan layanan PenaSakti akan diselesaikan melalui musyawarah untuk mufakat terlebih dahulu. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri Jakarta Pusat.",
    },
    {
      icon: AlertOctagon,
      title: "10. Ketentuan Terpisah",
      content:
        "Jika satu atau lebih ketentuan dalam syarat ini dianggap tidak sah, tidak berlaku, atau tidak dapat dilaksanakan oleh pengadilan yang berwenang, ketidakabsahan tersebut tidak akan mempengaruhi ketentuan lainnya yang akan tetap berlaku dan dilaksanakan sepenuhnya.",
    },
    {
      icon: RefreshCw,
      title: "11. Perubahan Syarat dan Ketentuan",
      content:
        "PenaSakti dapat memperbarui Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Pengguna disarankan untuk meninjau halaman ini secara berkala. Perubahan akan berlaku efektif sejak dipublikasikan di halaman ini. Penggunaan layanan yang berkelanjutan setelah perubahan merupakan persetujuan Anda terhadap syarat yang telah diperbarui.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
            <Gavel className="w-4 h-4" />
            Perjanjian Hukum yang Mengikat
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Syarat & <span className="text-penasakti-blue">Ketentuan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perjanjian hukum antara Anda dan PenaSakti dalam penggunaan seluruh
            layanan dan konten yang tersedia di platform kami.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Berlaku efektif mulai: 1 Januari 2026 | Terakhir diperbarui: 28 Juli 2026
          </p>
        </div>

        {/* Important Notice */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-8 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
              Harap Dibaca dengan Seksama
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-200/80">
              Syarat dan Ketentuan ini mengatur hubungan hukum antara Anda dan PenaSakti.
              Dengan mengakses atau menggunakan layanan kami, Anda dianggap telah membaca,
              memahami, dan menyetujui seluruh isi syarat ini tanpa pengecualian apapun.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map(({ icon: Icon, title, content, bullets }) => (
            <section
              key={title}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold mb-3">{title}</h2>
                  {bullets && bullets.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {content && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {content}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-penasakti-blue to-purple-600 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Pertanyaan Mengenai Syarat & Ketentuan?</h3>
          <p className="text-white/80 mb-4 text-sm">
            Tim hukum kami siap membantu menjawab pertanyaan Anda.
          </p>
          <a
            href="mailto:legal@penasakti.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-penasakti-blue font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            Hubungi Tim Legal
          </a>
        </div>
      </div>
    </div>
  );
}
