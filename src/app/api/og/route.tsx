/**
 * GET /api/og?title=...&image=...&category=...&author=...
 *
 * Generates a 1200×630 Open Graph image on-the-fly for article sharing.
 * Dipakai sebagai og:image di semua halaman artikel.
 *
 * WhatsApp, Telegram, Twitter/X, Facebook semua support format ini.
 * Edge runtime untuk kecepatan — tidak perlu full Node.js.
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Cache OG image 24 jam di CDN
export const revalidate = 86400;

const SITE_URL = "https://www.penasakti.com";

/**
 * Normalise image URL sebelum dipakai sebagai background OG:
 * - http://cdn.penasakti.com/wp-content/... → https://penasakti.com/wp-content/...
 *   (cdn.penasakti.com hanya HTTP dan sering diblokir edge runtime)
 * - URL lain dibiarkan apa adanya
 */
function normaliseImageUrl(url: string): string {
  if (!url) return url;
  // Ganti cdn subdomain (HTTP) ke domain utama HTTPS
  if (url.startsWith("http://cdn.penasakti.com")) {
    return url.replace("http://cdn.penasakti.com", "https://penasakti.com");
  }
  // Pastikan selalu HTTPS
  if (url.startsWith("http://www.penasakti.com")) {
    return url.replace("http://www.penasakti.com", "https://www.penasakti.com");
  }
  if (url.startsWith("http://penasakti.com")) {
    return url.replace("http://penasakti.com", "https://penasakti.com");
  }
  return url;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title    = searchParams.get("title")    || "PenaSakti - Portal Berita Nasional";
  const category = searchParams.get("category") || "Berita";
  const author   = searchParams.get("author")   || "Redaksi PenaSakti";
  const rawImage = searchParams.get("image")    || "";
  const imageUrl = normaliseImageUrl(rawImage);
  const excerpt  = searchParams.get("excerpt")  || "";

  // Truncate panjang teks agar tidak overflow
  const shortTitle   = title.length   > 80  ? title.slice(0, 80)   + "…" : title;
  const shortExcerpt = excerpt.length > 120 ? excerpt.slice(0, 120) + "…" : excerpt;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width:           "1200px",
            height:          "630px",
            display:         "flex",
            flexDirection:   "column",
            position:        "relative",
            fontFamily:      "'Segoe UI', Arial, sans-serif",
            overflow:        "hidden",
            backgroundColor: "#0f172a",
          }}
        >
          {/* Background image — artikel photo */}
          {imageUrl ? (
            <img
              src={imageUrl}
              style={{
                position:   "absolute",
                inset:      0,
                width:      "100%",
                height:     "100%",
                objectFit:  "cover",
                objectPosition: "center",
                opacity:    0.35,
              }}
            />
          ) : (
            /* Gradient background jika tidak ada gambar */
            <div
              style={{
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #dc2626 100%)",
                opacity:    0.6,
                display:    "flex",
              }}
            />
          )}

          {/* Dark gradient overlay dari bawah */}
          <div
            style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
              display:    "flex",
            }}
          />

          {/* Top bar: Logo + Category badge */}
          <div
            style={{
              position:       "absolute",
              top:            0,
              left:           0,
              right:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "28px 48px",
            }}
          >
            {/* Logo text */}
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "10px",
              }}
            >
              <div
                style={{
                  width:           "10px",
                  height:          "36px",
                  backgroundColor: "#dc2626",
                  borderRadius:    "3px",
                  display:         "flex",
                }}
              />
              <span
                style={{
                  fontSize:   "28px",
                  fontWeight: 800,
                  color:      "#ffffff",
                  letterSpacing: "-0.5px",
                }}
              >
                PenaSakti
              </span>
            </div>

            {/* Category badge */}
            <div
              style={{
                backgroundColor: "#dc2626",
                color:           "#ffffff",
                fontSize:        "15px",
                fontWeight:      700,
                padding:         "8px 20px",
                borderRadius:    "6px",
                textTransform:   "uppercase",
                letterSpacing:   "1px",
                display:         "flex",
              }}
            >
              {category}
            </div>
          </div>

          {/* Bottom: Title + excerpt + author */}
          <div
            style={{
              position:      "absolute",
              bottom:        0,
              left:          0,
              right:         0,
              padding:       "0 48px 40px",
              display:       "flex",
              flexDirection: "column",
              gap:           "12px",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize:    shortTitle.length > 60 ? "36px" : "42px",
                fontWeight:  800,
                color:       "#ffffff",
                lineHeight:  1.2,
                letterSpacing: "-0.5px",
                display:     "flex",
              }}
            >
              {shortTitle}
            </div>

            {/* Excerpt */}
            {shortExcerpt && (
              <div
                style={{
                  fontSize:   "20px",
                  color:      "rgba(255,255,255,0.7)",
                  lineHeight: 1.4,
                  display:    "flex",
                }}
              >
                {shortExcerpt}
              </div>
            )}

            {/* Author + domain */}
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "16px",
                marginTop:  "4px",
              }}
            >
              <div
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "8px",
                }}
              >
                <div
                  style={{
                    width:           "28px",
                    height:          "28px",
                    borderRadius:    "50%",
                    backgroundColor: "#dc2626",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    fontSize:        "14px",
                    color:           "#ffffff",
                    fontWeight:      700,
                  }}
                >
                  {author.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", display: "flex" }}>
                  {author}
                </span>
              </div>

              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.3)", display: "flex" }}>•</span>

              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", display: "flex" }}>
                penasakti.com
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width:  1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err) {
    console.error("[/api/og]", err);
    // Fallback: redirect ke og-image.jpg statis
    return Response.redirect(`${SITE_URL}/og-image.jpg`, 302);
  }
}
