/**
 * publish-hooks.ts
 *
 * Fungsi yang dipanggil server-side setiap kali artikel di-publish.
 * Menangani:
 * 1. Revalidasi cache ISR (halaman artikel, homepage, kategori, breaking news)
 * 2. Ping Google IndexNow agar artikel langsung terindeks
 * 3. Ping Bing IndexNow
 * 4. Submit ke Google Search Console via Indexing API (opsional, jika ada service account)
 *
 * Dipanggil dari: POST /api/articles dan PUT /api/articles/[slug]
 */

import { revalidatePath } from "next/cache";
import { SITE_URL } from "@/lib/site-url";

export interface PublishHookParams {
  slug: string;
  categorySlug?: string | null;
  isBreaking?: boolean;
  isFeatured?: boolean;
}

/**
 * Revalidasi semua halaman yang terpengaruh oleh artikel baru.
 * Harus dipanggil dari Server Action atau Route Handler.
 */
export async function revalidateAfterPublish(params: PublishHookParams) {
  const { slug, categorySlug, isBreaking, isFeatured } = params;

  try {
    // Halaman artikel itu sendiri
    revalidatePath(`/artikel/${slug}`);

    // Homepage — selalu karena menampilkan artikel terbaru
    revalidatePath("/");
    revalidatePath("/", "layout");

    // Halaman kategori jika ada
    if (categorySlug) {
      revalidatePath(`/kategori/${categorySlug}`);
    }

    // Breaking news section
    if (isBreaking) {
      revalidatePath("/breaking");
    }

    // Featured articles section
    if (isFeatured) {
      revalidatePath("/featured");
    }

    // Halaman pencarian & video
    revalidatePath("/pencarian");

    console.log(`[publish-hooks] Revalidated ISR cache for /artikel/${slug}`);
  } catch (err) {
    // Non-fatal: jangan sampai gagal publish karena revalidate error
    console.error("[publish-hooks] revalidateAfterPublish error:", err);
  }
}

/**
 * Ping IndexNow (Google, Bing, Yandex) agar halaman artikel langsung di-crawl.
 * IndexNow adalah protokol untuk memberitahu search engine ada konten baru.
 * Ref: https://www.indexnow.org/documentation
 */
export async function pingIndexNow(slug: string): Promise<void> {
  const articleUrl = `${SITE_URL}/artikel/${slug}`;
  const indexNowKey = process.env.INDEXNOW_KEY;

  if (!indexNowKey) {
    console.warn("[publish-hooks] INDEXNOW_KEY not set — skipping IndexNow ping");
    return;
  }

  const keyLocation = `${SITE_URL}/${indexNowKey}.txt`;

  const body = JSON.stringify({
    host: new URL(SITE_URL).hostname,
    key: indexNowKey,
    keyLocation,
    urlList: [articleUrl],
  });

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  const results = await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
        // Timeout 5 detik — jangan blokir publish
        signal: AbortSignal.timeout(5000),
      }).then((res) => ({
        endpoint,
        status: res.status,
        ok: res.ok,
      }))
    )
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log(`[publish-hooks] IndexNow ${result.value.endpoint} → ${result.value.status}`);
    } else {
      console.warn(`[publish-hooks] IndexNow ping failed:`, result.reason);
    }
  }
}

/**
 * Ping Google Search Console Indexing API.
 * Membutuhkan service account Google dengan izin "Search Console API".
 * Jika tidak ada credentials, fungsi ini skip secara diam-diam.
 *
 * Setup: https://developers.google.com/search/apis/indexing-api/v3/quickstart
 */
export async function pingGoogleIndexingAPI(slug: string): Promise<void> {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    // Opsional — tidak wajib
    return;
  }

  const articleUrl = `${SITE_URL}/artikel/${slug}`;

  try {
    // Dynamic import — library ini opsional, tidak wajib terinstall
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GoogleAuth } = await (Function('return import("google-auth-library")')() as Promise<{ GoogleAuth: any }>).catch(() => ({ GoogleAuth: null }));
    if (!GoogleAuth) {
      console.warn("[publish-hooks] google-auth-library not installed — skipping Google Indexing API");
      return;
    }

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();
    const accessToken = await (client as any).getAccessToken();
    const token = accessToken?.token || accessToken;

    if (!token) {
      console.warn("[publish-hooks] Could not obtain Google access token");
      return;
    }

    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: articleUrl, type: "URL_UPDATED" }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      console.log(`[publish-hooks] Google Indexing API → 200 for ${articleUrl}`);
    } else {
      const text = await res.text().catch(() => "");
      console.warn(`[publish-hooks] Google Indexing API → ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("[publish-hooks] Google Indexing API error:", err);
  }
}

/**
 * Jalankan semua publish hooks secara paralel.
 * Fungsi ini tidak boleh throw — semua error ditangani internal.
 */
export async function runAllPublishHooks(params: PublishHookParams): Promise<void> {
  const { slug, categorySlug, isBreaking, isFeatured } = params;

  // Jalankan semua hooks paralel, tidak saling menunggu
  await Promise.allSettled([
    revalidateAfterPublish({ slug, categorySlug, isBreaking, isFeatured }),
    pingIndexNow(slug),
    pingGoogleIndexingAPI(slug),
  ]);

  console.log(`[publish-hooks] All hooks completed for /artikel/${slug}`);
}
