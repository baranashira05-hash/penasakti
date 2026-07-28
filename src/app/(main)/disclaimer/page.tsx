import { Metadata } from "next";
import { AlertTriangle, Shield, FileWarning, BookOpen, CheckCircle2, XCircle, MessageSquare, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Pernyataan penyangkalan (disclaimer) resmi PenaSakti mengenai batasan tanggung jawab, akurasi konten, dan informasi umum.",
};

export default function DisclaimerPage() {
  const disclaimers = [
    {
      icon: BookOpen,
      title: "Akurasi & Kelengkapan Informasi",
      content:
        "PenaSakti berusaha sebaik mungkin untuk menyajikan informasi yang akurat, lengkap, dan terkini. Namun demikian, PenaSakti tidak memberikan jaminan atau garansi tersurat maupun tersirat mengenai keakuratan, kelengkapan, keandalan, kesesuaian, atau ketersediaan konten, produk, layanan, atau grafis terkait yang terkandung dalam situs web ini. Penggunaan informasi apa pun yang ada di situs ini sepenuhnya menjadi risiko Anda sendiri.",
    },
    {
      icon: Shield,
      title: "Bukan Nasihat Profesional",
      content:
        "Seluruh konten yang disajikan di PenaSakti bersifat untuk tujuan informasi umum saja dan bukan merupakan nasihat profesional, termasuk namun tidak terbatas pada nasihat keuangan, hukum, medis, investasi, pajak, atau nasihat lainnya. Sebelum mengambil keputusan berdasarkan konten dari situs kami, Anda disarankan untuk berkonsultasi dengan profesional yang kompeten di bidang terkait.",
    },
    {
      icon: XCircle,
      title: "Kesalahan & Kekurangan",
      content:
        "PenaSakti tidak menjamin bahwa situs web ini akan beroperasi tanpa gangguan, bebas dari kesalahan, atau bahwa server yang membuat situs ini tersedia bebas dari virus atau komponen berbahaya lainnya. PenaSakti tidak bertanggung jawab atas kehilangan atau kerusakan apa pun yang muncul karena adanya gangguan teknis, pemeliharaan, atau faktor di luar kendali kami.",
    },
    {
      icon: FileWarning,
      title: "Tautan ke Situs Pihak Ketiga",
      content:
        "Situs PenaSakti dapat memuat tautan ke situs web atau sumber daya eksternal yang dimiliki dan dioperasikan oleh pihak ketiga. PenaSakti tidak memiliki kendali atas isi, kebijakan privasi, atau praktik situs web pihak ketiga dan tidak menerima tanggung jawab apa pun atas mereka. Anda mengakui dan setuju bahwa PenaSakti tidak bertanggung jawab, secara langsung atau tidak langsung, atas kerugian yang disebabkan atau diduga disebabkan oleh penggunaan konten melalui tautan tersebut.",
    },
    {
      icon: MessageSquare,
      title: "Opini Komentar & Konten Pengguna",
      content:
        "Komentar, ulasan, opini, atau konten lain yang dikirimkan oleh pengguna PenaSakti merupakan pandangan pribadi masing-masing penulis dan tidak mewakili pandangan PenaSakti. PenaSakti tidak memverifikasi, mendukung, atau menjamin kebenaran, keakuratan, atau reliabilitas opini yang disampaikan oleh pengguna. Pengguna bertanggung jawab sepenuhnya atas konten yang mereka kirimkan.",
    },
    {
      icon: BarChart3,
      title: "Kinerja Masa Lalu",
      content:
        "Setiap penyajian data historis atau kinerja masa lalu yang terkandung dalam konten PenaSakti tidak boleh dianggap sebagai indikasi hasil di masa depan. Investasi, keputusan bisnis, atau tindakan lain yang didasarkan pada kinerja masa lalu memiliki risiko ketidakpastian yang tinggi.",
    },
    {
      icon: CheckCircle2,
      title: "Upaya Pemeriksaan & Koreksi",
      content:
        "PenaSakti berkomitmen tinggi terhadap prinsip-prinsip jurnalisme yang akurat dan bertanggung jawab. Kami secara aktif melakukan pengecekan fakta dan verifikasi sebelum mempublikasikan konten. Jika Anda menemukan kesalahan, ketidakakuratan, atau informasi yang menyesatkan, silakan segera hubungi kami di koreksi@penasakti.com. Kami akan segera melakukan verifikasi dan koreksi jika diperlukan.",
    },
    {
      icon: AlertTriangle,
      title: "Batasan Tanggung Jawab",
      content:
        "Dalam kondisi apapun, PenaSakti, pengarah, pejabat, karyawan, afiliasi, mitra, atau pemberi lisensi tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, konsekuensial, atau kerusakan apapun yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan ini, bahkan jika PenaSakti telah diberitahu sebelumnya mengenai kemungkinan kerusakan tersebut.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-full text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            Pernyataan Resmi
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            <span className="text-penasakti-red">Disclaimer</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pernyataan penyangkalan resmi yang menjelaskan batasan tanggung jawab,
            sifat informasi, dan penggunaan konten yang ada di PenaSakti.
          </p>
        </div>

        {/* Red Banner */}
        <div className="p-6 rounded-2xl bg-penasakti-red/10 border-2 border-penasakti-red/30 mb-10">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-penasakti-red flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-penasakti-red mb-1">
                Informasi Penting
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SELURUH KONTEN YANG TERSEDIA DI PENASAKTI BERSIFAT INFORMASI UMUM SAJA
                DAN TIDAK DIMAKSUDKAN SEBAGAI NASIHAT PROFESIONAL DALAM BENTUK APAPUN.
                PENGGUNAAN INFORMASI DARI SITUS INI ADALAH TANGGUNG JAWAB PENUH ANDA.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="space-y-4">
          {disclaimers.map(({ icon: Icon, title, content }) => (
            <section
              key={title}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold mb-3">{title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Agreement */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/30 border border-border text-center">
          <h3 className="text-lg font-bold mb-2">Penerimaan Disclaimer</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
            Dengan terus mengakses dan menggunakan layanan PenaSakti, Anda dinyatakan
            telah membaca, memahami, dan secara tegas menyetujui seluruh isi
            pernyataan disclaimer ini. Jika Anda tidak setuju, harap segera
            menghentikan penggunaan layanan kami.
          </p>
          <a
            href="/kontak"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-penasakti-blue text-white font-semibold rounded-lg hover:bg-penasakti-blue/90 transition-colors"
          >
            Hubungi Kami untuk Koreksi
          </a>
        </div>
      </div>
    </div>
  );
}
