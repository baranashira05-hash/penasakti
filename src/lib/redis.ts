import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedis();
    if (!client) return null;
    try {
      const data = await client.get<T>(key);
      return data;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttl = 300): Promise<void> {
    const client = getRedis();
    if (!client) return;
    try {
      await client.set(key, JSON.stringify(value), { ex: ttl });
    } catch {
      // fail silently
    }
  },

  async del(key: string): Promise<void> {
    const client = getRedis();
    if (!client) return;
    try {
      await client.del(key);
    } catch {
      // fail silently
    }
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const client = getRedis();
    if (!client) return;
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch {
      // fail silently
    }
  },
};

export const CACHE_KEYS = {
  ARTICLES_HOME: "articles:home",
  ARTICLES_TRENDING: "articles:trending",
  ARTICLES_FEATURED: "articles:featured",
  ARTICLES_BREAKING: "articles:breaking",
  ARTICLE: (slug: string) => `article:${slug}`,
  CATEGORY: (slug: string) => `category:${slug}`,
  CATEGORIES_ALL: "categories:all",
  SEARCH: (query: string) => `search:${query}`,
  ANALYTICS_REALTIME: "analytics:realtime",
  TRENDING_SEARCHES: "trending:searches",
};

export const CACHE_TTL = {
  SHORT: 60,       // 1 minute
  MEDIUM: 300,     // 5 minutes
  LONG: 3600,      // 1 hour
  DAY: 86400,      // 1 day
  WEEK: 604800,    // 1 week
};

export default getRedis;
