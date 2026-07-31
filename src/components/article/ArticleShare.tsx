"use client";

import { useState } from "react";
import { Share2, Link2, MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";

interface ArticleShareProps {
  url: string;
  title: string;
}

export default function ArticleShare({ url, title }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      color: "bg-green-500 hover:bg-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      name: "Twitter/X",
      color: "bg-black hover:bg-gray-800",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: <span className="text-xs font-bold">𝕏</span>,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold flex items-center gap-2 mr-2">
          <Share2 className="w-4 h-4" /> Bagikan:
        </span>
        {shareLinks.map(({ name, icon, color, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Bagikan ke ${name}`}
            className={`${color} text-white p-2.5 rounded-xl transition-colors`}
          >
            {icon}
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="bg-muted hover:bg-muted/80 p-2.5 rounded-xl transition-colors"
          aria-label="Salin link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
