/**
 * WordPress REST API Service
 * Fetches data from https://penasakti.com/wp-json/wp/v2/
 */

const WP_API_URL = "https://penasakti.com/wp-json/wp/v2";
const PER_PAGE = 100;

interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_image?: { url: string }[];
    canonical?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text: string }[];
    author?: { id: number; name: string; slug: string; avatar_urls?: Record<string, string> }[];
  };
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
}

interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: { rendered: string };
  media_details?: {
    width: number;
    height: number;
    file: string;
  };
}

interface WPUser {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls?: Record<string, string>;
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "PenaSakti-Migrator/1.0" },
        next: { revalidate: 0 },
      });
      if (res.ok) return res;
      if (res.status === 429) {
        // Rate limited, wait and retry
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      if (res.status === 404) throw new Error(`404: ${url}`);
      throw new Error(`HTTP ${res.status}: ${url}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

async function fetchAllPages<T>(endpoint: string, params = ""): Promise<T[]> {
  const allItems: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const sep = params ? "&" : "?";
    const url = `${WP_API_URL}/${endpoint}?per_page=${PER_PAGE}&page=${page}${params ? sep + params : ""}`;

    try {
      const res = await fetchWithRetry(url);
      const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
      const data = await res.json() as T[];

      allItems.push(...data);
      hasMore = page < totalPages;
      page++;
    } catch {
      hasMore = false;
    }
  }

  return allItems;
}

// ====== PUBLIC API ======

export async function getPosts(page = 1, perPage = PER_PAGE): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const url = `${WP_API_URL}/posts?per_page=${perPage}&page=${page}&_embed=true&status=publish`;
  const res = await fetchWithRetry(url);
  const total = parseInt(res.headers.get("X-WP-Total") || "0");
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
  const posts = await res.json() as WPPost[];
  return { posts, total, totalPages };
}

export async function getAllPosts(): Promise<WPPost[]> {
  return fetchAllPages<WPPost>("posts", "_embed=true&status=publish");
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const url = `${WP_API_URL}/posts?slug=${encodeURIComponent(slug)}&_embed=true`;
  const res = await fetchWithRetry(url);
  const posts = await res.json() as WPPost[];
  return posts[0] || null;
}

export async function getCategories(): Promise<WPCategory[]> {
  return fetchAllPages<WPCategory>("categories");
}

export async function getTags(): Promise<WPTag[]> {
  return fetchAllPages<WPTag>("tags");
}

export async function getAuthors(): Promise<WPUser[]> {
  return fetchAllPages<WPUser>("users");
}

export async function getMedia(page = 1): Promise<WPMedia[]> {
  const url = `${WP_API_URL}/media?per_page=${PER_PAGE}&page=${page}`;
  const res = await fetchWithRetry(url);
  return res.json() as Promise<WPMedia[]>;
}

// Helper: extract featured image URL from embedded post
export function getFeaturedImage(post: WPPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"];
  if (media && media[0]?.source_url) return media[0].source_url;
  return null;
}

// Helper: extract author from embedded post
export function getAuthor(post: WPPost): { name: string; slug: string; avatar?: string } | null {
  const author = post._embedded?.author;
  if (author && author[0]) {
    return {
      name: author[0].name,
      slug: author[0].slug,
      avatar: author[0].avatar_urls?.["96"] || undefined,
    };
  }
  return null;
}

// Helper: clean HTML content (remove WP shortcodes etc)
export function cleanContent(html: string): string {
  return html
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gi, "$1")
    .replace(/\[.*?\]/g, "")
    .replace(/<!--.*?-->/gs, "")
    .trim();
}

// Helper: extract meta from Yoast
export function getYoastMeta(post: WPPost) {
  const yoast = post.yoast_head_json;
  return {
    metaTitle: yoast?.title || post.title.rendered,
    metaDesc: yoast?.description || "",
    ogImage: yoast?.og_image?.[0]?.url || getFeaturedImage(post) || "",
    canonical: yoast?.canonical || "",
  };
}

export type { WPPost, WPCategory, WPTag, WPMedia, WPUser };
