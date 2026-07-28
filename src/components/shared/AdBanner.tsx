import Link from "next/link";

interface AdBannerProps {
  position: "HEADER" | "SIDEBAR" | "IN_ARTICLE" | "FOOTER" | "STICKY_BOTTOM";
  className?: string;
}

const AD_CONFIG = {
  HEADER: {
    label: "Leaderboard",
    size: "728 × 90 px",
    mobileSize: "320 × 50 px",
    height: "h-[50px] md:h-[90px]",
    width: "max-w-[320px] md:max-w-[728px]",
  },
  SIDEBAR: {
    label: "Medium Rectangle",
    size: "300 × 250 px",
    mobileSize: "300 × 250 px",
    height: "h-[250px]",
    width: "max-w-[300px]",
  },
  IN_ARTICLE: {
    label: "In-Article Banner",
    size: "468 × 60 px",
    mobileSize: "320 × 50 px",
    height: "h-[50px] md:h-[60px]",
    width: "max-w-[320px] md:max-w-[468px]",
  },
  FOOTER: {
    label: "Large Leaderboard",
    size: "970 × 90 px",
    mobileSize: "320 × 50 px",
    height: "h-[50px] md:h-[90px]",
    width: "max-w-[320px] md:max-w-[970px]",
  },
  STICKY_BOTTOM: {
    label: "Mobile Banner",
    size: "320 × 50 px",
    mobileSize: "320 × 50 px",
    height: "h-[50px]",
    width: "max-w-[320px] md:max-w-[728px]",
  },
};

export default function AdBanner({ position, className }: AdBannerProps) {
  const config = AD_CONFIG[position];

  return (
    <div className={`w-full flex justify-center ${className || ""}`} data-ad-position={position}>
      <Link
        href="/pasang-iklan"
        className={`${config.width} w-full ${config.height} bg-gray-100 dark:bg-slate-800/50 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group`}
      >
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {config.label}
        </span>
        <span className="text-[10px] text-gray-300 dark:text-gray-600">
          <span className="hidden md:inline">{config.size}</span>
          <span className="md:hidden">{config.mobileSize}</span>
        </span>
        <span className="text-[10px] text-blue-400 dark:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
          Pasang Iklan di Sini →
        </span>
      </Link>
    </div>
  );
}
