"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, ThumbsUp, Flag, Reply, Send } from "lucide-react";
import { toast } from "sonner";

const DEMO_COMMENTS = [
  {
    id: "c1",
    user: { name: "Budi Santoso", image: null },
    content: "Semoga stimulus ini benar-benar diimplementasikan dengan baik dan transparan. Indonesia butuh gebrakan ekonomi seperti ini!",
    likeCount: 45,
    timeLabel: "1 jam lalu",
    replies: [
      {
        id: "c1r1",
        user: { name: "Dewi Lestari", image: null },
        content: "Setuju sekali! Kita tunggu realisasinya. Yang terpenting adalah pengawasan yang ketat agar tidak ada penyelewengan.",
        likeCount: 12,
        timeLabel: "30 menit lalu",
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    user: { name: "Hendra Wijaya", image: null },
    content: "Pertanyaannya sekarang: dari mana sumber dananya? Apakah dari utang lagi atau ada sumber pembiayaan lain?",
    likeCount: 32,
    timeLabel: "2 jam lalu",
    replies: [],
  },
];

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments] = useState(DEMO_COMMENTS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Komentar Anda sedang dimoderasi");
      setComment("");
    } catch {
      toast.error("Gagal mengirim komentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-border" id="komentar">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Komentar ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-muted/30 rounded-2xl p-5 mb-8 border border-border">
        <h3 className="font-semibold mb-4">
          {session ? `Berkomentar sebagai ${session.user.name}` : "Tulis Komentar"}
        </h3>
        {!session && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Nama Anda *"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm"
            />
            <input
              type="email"
              placeholder="Email (tidak dipublikasikan)"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm"
            />
          </div>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tulis komentar Anda..."
          rows={4}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            Komentar akan dimoderasi sebelum ditampilkan
          </p>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-penasakti-blue text-white rounded-xl text-sm font-semibold hover:bg-penasakti-blue/90 transition-colors disabled:opacity-70"
          >
            <Send className="w-4 h-4" />
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-penasakti-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="font-bold text-penasakti-blue">
                {c.user.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <div className="bg-card rounded-2xl rounded-tl-none p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{c.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.timeLabel}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{c.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-2 ml-1">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-penasakti-blue transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" /> {c.likeCount}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-penasakti-blue transition-colors">
                  <Reply className="w-3.5 h-3.5" /> Balas
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                  <Flag className="w-3.5 h-3.5" /> Laporkan
                </button>
              </div>

              {/* Replies */}
              {c.replies.length > 0 && (
                <div className="mt-4 space-y-3 ml-6 border-l-2 border-border pl-4">
                  {c.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="font-bold text-xs text-muted-foreground">
                          {reply.user.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/30 rounded-2xl rounded-tl-none p-3 border border-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs">{reply.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {reply.timeLabel}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
