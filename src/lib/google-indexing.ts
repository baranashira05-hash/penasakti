/**
 * Google Indexing API
 * Kirim notifikasi ke Google agar artikel baru langsung di-crawl.
 *
 * Setup:
 * 1. Buka https://console.cloud.google.com
 * 2. Buat/pilih project → APIs & Services → Enable "Web Search Indexing API"
 * 3. Buat Service Account → buat JSON key → copy isinya ke env GOOGLE_INDEXING_SA_JSON
 * 4. Di Google Search Console → Settings → Users and permissions →
 *    Add "Owner" dengan email service account (xxx@xxx.iam.gserviceaccount.com)
 *
 * Env yang dibutuhkan:
 *   GOOGLE_INDEXING_SA_JSON = isi file JSON service account (satu baris, escaped)
 */

import { SITE_URL } from "@/lib/site-url";

const INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/indexing";

/** Buat JWT untuk Google Service Account */
async function getAccessToken(): Promise<string | null> {
  try {
    const saJson = process.env.GOOGLE_INDEXING_SA_JSON;
    if (!saJson) return null;

    const sa = JSON.parse(saJson);
    const now = Math.floor(Date.now() / 1000);

    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    };

    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString("base64url");

    const headerB64 = encode(header);
    const payloadB64 = encode(payload);
    const unsigned = `${headerB64}.${payloadB64}`;

    // Import private key
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      pemToBuffer(sa.private_key),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      new TextEncoder().encode(unsigned)
    );

    const signatureB64 = Buffer.from(signature).toString("base64url");
    const jwt = `${unsigned}.${signatureB64}`;

    // Exchange JWT → Access Token
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    const tokenData = await tokenRes.json();
    return tokenData.access_token ?? null;
  } catch (err) {
    console.error("[GoogleIndexing] getAccessToken error:", err);
    return null;
  }
}

/** Konversi PEM string → ArrayBuffer */
function pemToBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

/**
 * Kirim URL ke Google Indexing API
 * type: "URL_UPDATED" (artikel baru/update) | "URL_DELETED" (artikel dihapus)
 */
export async function notifyGoogleIndexing(
  slug: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${SITE_URL}/artikel/${slug}`;
    const token = await getAccessToken();

    if (!token) {
      console.warn("[GoogleIndexing] Skipped — GOOGLE_INDEXING_SA_JSON not set");
      return { success: false, message: "Service account tidak dikonfigurasi" };
    }

    const res = await fetch(INDEXING_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`[GoogleIndexing] ✅ Notified: ${url}`);
      return { success: true, message: `URL dikirim ke Google: ${url}` };
    } else {
      console.error(`[GoogleIndexing] ❌ Error:`, data);
      return { success: false, message: data.error?.message ?? "Gagal notify Google" };
    }
  } catch (err) {
    console.error("[GoogleIndexing] notifyGoogleIndexing error:", err);
    return { success: false, message: "Error menghubungi Google Indexing API" };
  }
}

/**
 * Ping Google & Bing sitemap agar crawler segera kunjungi sitemap terbaru.
 * Ini tidak secepat Indexing API, tapi sebagai backup.
 */
export async function pingSitemaps(): Promise<void> {
  const sitemapUrl = encodeURIComponent(`${SITE_URL}/news-sitemap.xml`);
  const urls = [
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
  ];

  await Promise.allSettled(
    urls.map((u) =>
      fetch(u, { method: "GET" })
        .then(() => console.log(`[Sitemap Ping] ✅ ${u}`))
        .catch((e) => console.warn(`[Sitemap Ping] ⚠️ ${u}:`, e))
    )
  );
}
