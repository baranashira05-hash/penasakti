import { Metadata } from "next";
import { Shield, Eye, Lock, Database, Mail, FileText, Cookie, Smartphone, Globe, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan Privasi PenaSakti menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan memproses data pribadi Anda sesuai dengan UU PDP.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Informasi yang Kami Kumpulkan",
      bullets: [
        "Informasi akun: nama, email, nomor telepon, foto profil saat Anda mendaftar",
        "Informasi teknis: alamat IP, jenis perangkat, browser, sistem operasi",
        "Data penggunaan: halaman yang dikunjungi, waktu akses, lama membaca, klik iklan",
        "Data lokasi: data lokasi perangkat (jika diizinkan oleh pengguna)",
        "Konten pengguna: komentar, bookmark, reading list, masukan, dan korespondensi",
        "Data transaksi: untuk pembelian konten premium (jika berlaku)",
      ],
    },
    {
      icon: Database,
      title: "Cara Kami Menggunakan Informasi",
      bullets: [
        "Menyediakan, memelihara, dan meningkatkan layanan PenaSakti",
        "Mempersonalisasi konten dan rekomendasi berita sesuai preferensi Anda",
        "Mengirimkan newsletter, notifikasi, dan pembaruan layanan",
        "Menganalisis dan memahami perilaku pengguna untuk pengalaman yang lebih baik",
        "Menampilkan iklan yang relevan melalui Google AdSense dan mitra periklanan",
        "Mendeteksi, mencegah, dan menangani aktivitas penipuan atau penyalahgunaan",
        "Memenuhi kewajiban hukum dan peraturan perundang-undangan yang berlaku",
      ],
    },
    {
      icon: Cookie,
      title: "Penggunaan Cookies & Teknologi Serupa",
      content:
        "PenaSakti menggunakan cookies, localStorage, dan teknologi serupa untuk: mengingat preferensi Anda (termasuk tema gelap/terang), mengukur dan menganalisis traffic situs, menampilkan iklan yang relevan, mempertahankan sesi login, dan mengoptimalkan performa website. Anda dapat mengatur preferensi cookies melalui pengaturan browser. Namun, menonaktifkan cookies tertentu dapat mempengaruhi fungsionalitas situs.",
    },
    {
      icon: Shield,
      title: "Keamanan Data",
      content:
        "Kami berkomitmen untuk melindungi data pribadi Anda dengan langkah-langkah keamanan teknis dan organisasi yang sesuai standar industri, termasuk: enkripsi data dengan TLS/SSL untuk transmisi data, otentikasi dua faktor (2FA) untuk akun pengguna, firewall dan sistem deteksi intrusi, kontrol akses berbasis peran untuk internal tim, serta audit keamanan secara berkala. Meskipun demikian, tidak ada metode transmisi atau penyimpanan data yang 100% aman di internet.",
    },
    {
      icon: Lock,
      title: "Pembagian Data Pribadi",
      bullets: [
        "Pihak ketiga penyedia layanan (hosting, CDN, email, analytics, periklanan)",
        "Instansi pemerintah atau penegak hukum sesuai dengan kewajiban hukum",
        "Mitra bisnis dalam rangka kerjasama yang telah Anda setujui",
        "Dalam rangka merger, akuisisi, atau penjualan aset (dengan pemberitahuan sebelumnya)",
      ],
      content: "Kami TIDAK menjual data pribadi Anda kepada pihak ketiga manapun. Data hanya dibagikan jika diperlukan untuk operasional layanan dan sesuai dengan persetujuan Anda atau kewajiban hukum.",
    },
    {
      icon: Globe,
      title: "Transfer Data Lintas Negara",
      content:
        "Data pribadi Anda dapat diproses dan disimpan di server yang berlokasi di luar Indonesia (seperti Singapura, Amerika Serikat, atau Uni Eropa) melalui penyedia layanan cloud terpercaya. Kami memastikan bahwa transfer data ini dilakukan dengan mekanisme perlindungan yang memadai sesuai dengan ketentuan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi.",
    },
    {
      icon: FileText,
      title: "Hak Anda sebagai Pemilik Data",
      bullets: [
        "Hak untuk mengakses dan mendapatkan salinan data pribadi Anda",
        "Hak untuk memperbaiki atau memperbarui data yang tidak akurat",
        "Hak untuk meminta penghapusan data (hak dilupakan)",
        "Hak untuk membatasi atau menolak pemrosesan data",
        "Hak untuk menarik persetujuan kapan saja",
        "Hak untuk mengajukan keberatan atas pemrosesan data",
        "Hak untuk mengajukan keluhan ke Kementerian Komunikasi dan Informatika",
      ],
      content:
        "Untuk menjalankan hak-hak di atas, silakan hubungi kami melalui email ke privacy@penasakti.com atau melalui fitur pengaturan di dashboard akun Anda. Kami akan memproses permintaan Anda dalam waktu paling lambat 14 hari kerja.",
    },
    {
      icon: Smartphone,
      title: "Layanan Pihak Ketiga",
      bullets: [
        "Google Analytics (pengukuran traffic dan perilaku pengguna)",
        "Google AdSense & Google Ad Manager (monetisasi iklan)",
        "Cloudinary & UploadThing (penyimpanan media)",
        "Upstash Redis (cache dan performa situs)",
        "Auth.js / NextAuth (otentikasi pengguna)",
        "Cloudflare (CDN dan perlindungan keamanan)",
      ],
      content:
        "Penggunaan layanan pihak ketiga diatur oleh kebijakan privasi masing-masing penyedia layanan. Kami mendorong Anda untuk membaca kebijakan privasi mereka.",
    },
    {
      icon: AlertTriangle,
      title: "Perubahan Kebijakan Privasi",
      content:
        "Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk menyesuaikan dengan perkembangan layanan, teknologi, atau peraturan perundang-undangan. Perubahan signifikan akan kami informasikan melalui notifikasi di situs atau email. Tanggal pembaruan terakhir akan tercantum di bagian bawah halaman ini. Dengan terus menggunakan layanan PenaSakti setelah perubahan, Anda dianggap menyetujui kebijakan yang telah diperbarui.",
    },
    {
      icon: Mail,
      title: "Kontak Kami",
      content:
        "Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau perlindungan data pribadi di PenaSakti, silakan hubungi Data Protection Officer (DPO) kami melalui: Email: privacy@penasakti.com | Telp: (021) 123-4567 | Alamat: Jl. Jurnalisme No. 1, Jakarta Pusat 10110.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
            <CheckCircle className="w-4 h-4" />
            Sesuai UU No. 27/2022 PDP
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Kebijakan <span className="text-penasakti-blue">Privasi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Komitmen PenaSakti dalam melindungi data pribadi dan privasi
            setiap pengguna sesuai dengan peraturan perundang-undangan yang berlaku.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Terakhir diperbarui: 28 Juli 2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map(({ icon: Icon, title, content, bullets }) => (
            <section
              key={title}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-penasakti-blue/10 text-penasakti-blue flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold mb-3">{title}</h2>
                  {bullets && bullets.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-penasakti-blue mt-2 flex-shrink-0" />
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
      </div>
    </div>
  );
}
