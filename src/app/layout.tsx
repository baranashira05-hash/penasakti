import type { Metadata, Viewport } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { QueryProvider } from "@/components/shared/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const APP_NAME = "PenaSakti";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Portal Berita Nasional Terpercaya`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "PenaSakti adalah portal berita nasional terpercaya yang menyajikan informasi terkini, akurat, dan berimbang seputar politik, ekonomi, teknologi, olahraga, dan gaya hidup.",
  keywords: [
    "berita terkini",
    "berita nasional",
    "berita indonesia",
    "portal berita",
    "penasakti",
    "berita hari ini",
  ],
  authors: [{ name: "Redaksi PenaSakti", url: APP_URL }],
  creator: "PenaSakti",
  publisher: "PenaSakti",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Portal Berita Nasional Terpercaya`,
    description:
      "Portal berita nasional terpercaya, cepat, dan berimbang. Baca berita terkini Indonesia dan dunia.",
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "PenaSakti - Portal Berita Nasional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Portal Berita Nasional`,
    description: "Portal berita nasional terpercaya.",
    site: "@penasakti",
    creator: "@penasakti",
  },
  alternates: {
    canonical: APP_URL,
    types: {
      "application/rss+xml": `${APP_URL}/rss.xml`,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo-penasakti.png", sizes: "any", type: "image/png" },
    ],
    apple: [{ url: "/logo-penasakti.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a3a6b" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  classNames: {
                    toast: "bg-background border border-border",
                    title: "text-foreground",
                    description: "text-muted-foreground",
                  },
                }}
              />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
