import { Metadata } from "next";
import { Users, Pen, Camera, Edit3, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Redaksi",
  description: "Mengenal lebih dekat tim redaksi PenaSakti yang bekerja keras menyajikan berita terbaik untuk Anda.",
};

export default function RedaksiPage() {
  const editors = [
    { name: "Dr. Ahmad Wijaya", role: "Pemimpin Redaksi", email: "ahmad@penasakti.com", dept: "Pimpinan", image: "https://picsum.photos/seed/red1/200/200" },
    { name: "Siti Nurhaliza, M.Si.", role: "Wakil Pemimpin Redaksi", email: "siti@penasakti.com", dept: "Pimpinan", image: "https://picsum.photos/seed/red2/200/200" },
    { name: "Budi Prasetyo", role: "Managing Editor", email: "budi@penasakti.com", dept: "Pimpinan", image: "https://picsum.photos/seed/red3/200/200" },
  ];

  const sections = [
    {
      title: "Desk Politik & Hukum",
      icon: Pen,
      color: "bg-purple-500",
      members: [
        { name: "Dewi Lestari", role: "Head of Desk", image: "https://picsum.photos/seed/sec1a/150/150" },
        { name: "Fajar Nugroho", role: "Reporter Senior", image: "https://picsum.photos/seed/sec1b/150/150" },
        { name: "Maya Putri", role: "Reporter", image: "https://picsum.photos/seed/sec1c/150/150" },
      ],
    },
    {
      title: "Desk Ekonomi & Bisnis",
      icon: Newspaper,
      color: "bg-green-500",
      members: [
        { name: "Rizki Hakim", role: "Head of Desk", image: "https://picsum.photos/seed/sec2a/150/150" },
        { name: "Linda Wijaya", role: "Reporter Senior", image: "https://picsum.photos/seed/sec2b/150/150" },
        { name: "Arif Rahman", role: "Reporter", image: "https://picsum.photos/seed/sec2c/150/150" },
      ],
    },
    {
      title: "Desk Teknologi",
      icon: Edit3,
      color: "bg-teal-500",
      members: [
        { name: "Kevin Sanjaya", role: "Head of Desk", image: "https://picsum.photos/seed/sec3a/150/150" },
        { name: "Nina Ayu", role: "Reporter Senior", image: "https://picsum.photos/seed/sec3b/150/150" },
      ],
    },
    {
      title: "Desk Olahraga",
      icon: Users,
      color: "bg-orange-500",
      members: [
        { name: "Yudi Pratama", role: "Head of Desk", image: "https://picsum.photos/seed/sec4a/150/150" },
        { name: "Rina Amelia", role: "Reporter", image: "https://picsum.photos/seed/sec4b/150/150" },
        { name: "Dimas Adi", role: "Reporter", image: "https://picsum.photos/seed/sec4c/150/150" },
      ],
    },
    {
      title: "Desk Foto & Visual",
      icon: Camera,
      color: "bg-blue-500",
      members: [
        { name: "Eko Prabowo", role: "Foto Editor", image: "https://picsum.photos/seed/sec5a/150/150" },
        { name: "Sari Dewi", role: "Fotografer Senior", image: "https://picsum.photos/seed/sec5b/150/150" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Tim <span className="text-penasakti-red">Redaksi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tim profesional yang terdiri dari jurnalis berpengalaman, editor, fotografer,
            dan tim kreatif yang berdedikasi menyajikan informasi berkualitas.
          </p>
        </div>

        {/* Pimpinan Redaksi */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-penasakti-red rounded-full" />
            Pimpinan Redaksi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editors.map((editor) => (
              <div
                key={editor.name}
                className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-penasakti-blue/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-penasakti-blue/10 transition-colors" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-4 ring-penasakti-blue/10">
                    <img
                      src={editor.image}
                      alt={editor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-penasakti-red/10 text-penasakti-red text-xs font-bold rounded mb-2">
                    {editor.dept}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{editor.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{editor.role}</p>
                  <a
                    href={`mailto:${editor.email}`}
                    className="text-sm text-penasakti-blue hover:underline"
                  >
                    {editor.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Desk Sections */}
        <div className="space-y-10">
          {sections.map(({ title, icon: Icon, color, members }) => (
            <section key={title}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-penasakti-blue/30 hover:bg-card/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-muted/50 border border-border text-center">
          <h3 className="text-xl font-bold mb-2">Tertarik Bergabung dengan Tim Redaksi?</h3>
          <p className="text-muted-foreground mb-4">
            Kami selalu mencari bakat-bakat baru yang bersemangat di dunia jurnalisme.
          </p>
          <a
            href="mailto:hrd@penasakti.com?subject=Lamaran Jurnalis"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-penasakti-blue text-white font-semibold rounded-lg hover:bg-penasakti-blue/90 transition-colors"
          >
            Kirim Lamaran Anda
          </a>
        </div>
      </div>
    </div>
  );
}
