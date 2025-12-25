import { Redis } from "@upstash/redis";

// Initialize Redis client (only if environment variables are set)
const redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? Redis.fromEnv()
        : null;

/**
 * Get cached value by key
 * Returns null if Redis is not configured or key doesn't exist
 */
export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
        return await redis.get<T>(key);
    } catch (error) {
        console.error("Redis get error:", error);
        return null;
    }
}

/**
 * Set cache with TTL (default 5 minutes)
 */
export async function setCache(
    key: string,
    value: unknown,
    ttlSeconds: number = 300
): Promise<void> {
    if (!redis) return;
    try {
        await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.error("Redis set error:", error);
    }
}

/**
 * Invalidate cache by exact key
 */
export async function invalidateCache(key: string): Promise<void> {
    if (!redis) return;
    try {
        await redis.del(key);
    } catch (error) {
        console.error("Redis delete error:", error);
    }
}

/**
 * Invalidate multiple cache keys by pattern (use with caution in production)
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
    if (!redis) return;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        console.error("Redis pattern delete error:", error);
    }
}

// Cache key generators for consistent naming
export const CacheKeys = {
    user: (userId: string) => `user:${userId}`,
    usersList: (page: number, search: string) =>
        `users:list:${page}:${search || "all"}`,
    thread: (threadId: string) => `thread:${threadId}`,
    threadsFeed: () => `threads:feed`,
    userThreads: (userId: string) => `threads:user:${userId}`,
    community: (communityId: string) => `community:${communityId}`,
    communities: () => `communities:list`,
};

export { redis };
