import type { Metadata, Viewport } from "next";
import { Inter, Merriweather } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { QueryProvider } from "@/components/shared/QueryProvider";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/site-url";
import SocialSidebar from "@/components/shared/SocialSidebar";

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
// Hard-coded canonical — SELALU penasakti.com, jangan pakai env var
const APP_URL = SITE_URL;

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
    "berita online",
    "portal berita indonesia",
  ],
  authors: [{ name: "Redaksi PenaSakti", url: APP_URL }],
  creator: "PenaSakti",
  publisher: "PenaSakti",
  category: "news",
  classification: "News",
  verification: {
    google: "KmEDoRWCc4pWbSl_-rfKwgS5vMmV4n93dU3v6YO8Af0",
  },
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
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
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
  // JSON-LD Organization + WebSite schema di level root
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": APP_NAME,
    "url": APP_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${APP_URL}/logo-penasakti.png`,
      "width": 200,
      "height": 60,
    },
    "sameAs": [
      "https://twitter.com/penasakti",
      "https://www.facebook.com/penasakti",
      "https://www.instagram.com/penasakti",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "redaksi@penasakti.com",
      "contactType": "editorial",
      "availableLanguage": "Indonesian",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": APP_NAME,
    "url": APP_URL,
    "description": "Portal berita nasional terpercaya Indonesia",
    "inLanguage": "id-ID",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${APP_URL}/pencarian?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* RSS Feed Discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="PenaSakti RSS Feed"
          href={`${APP_URL}/rss.xml`}
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
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
              <SocialSidebar />
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

        {/* Google Subscribe with Google (Reader Revenue Manager) */}
        <Script
          src="https://news.google.com/swg/js/v1/swg-basic.js"
          strategy="afterInteractive"
          async
          type="application/javascript"
        />
        <Script id="swg-init" strategy="afterInteractive">
          {`
            (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
              basicSubscriptions.init({
                type: "NewsArticle",
                isPartOfType: ["Product"],
                isPartOfProductId: "CAow3ac9DA:openaccess",
                clientOptions: { theme: "light", lang: "id" },
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
