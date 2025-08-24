/**
 * Caching utilities for Xonora backend service
 * Provides in-memory caching with TTL, size limits, and invalidation strategies
 */

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items in cache
  cleanupInterval: number; // Cleanup interval in milliseconds
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

export class DataCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 1000, // 1000 items default
      cleanupInterval: 60 * 1000, // 1 minute cleanup interval
      ...config
    };
    
    this.startCleanupTimer();
  }

  /**
   * Get data from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access count for LRU
    entry.accessCount++;
    return entry.data;
  }

  /**
   * Set data in cache
   */
  set(key: string, data: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 1
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidate(pattern: string | RegExp): number {
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string') {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      } else {
        if (pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
    }

    keysToDelete.forEach(key => {
      if (this.cache.delete(key)) {
        deletedCount++;
      }
    });

    return deletedCount;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalAccessCount = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > this.config.ttl) {
        expiredCount++;
      }
      totalAccessCount += entry.accessCount;
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      expiredCount,
      totalAccessCount,
      hitRate: this.cache.size > 0 ? totalAccessCount / this.cache.size : 0
    };
  }

  /**
   * Evict oldest entries (LRU strategy)
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    let lowestAccessCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < lowestAccessCount || 
          (entry.accessCount === lowestAccessCount && entry.timestamp < oldestTimestamp)) {
        oldestKey = key;
        oldestTimestamp = entry.timestamp;
        lowestAccessCount = entry.accessCount;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Pre-configured cache instances for different data types
export const poolsCache = new DataCache<any[]>({
  ttl: 2 * 60 * 1000, // 2 minutes for pools
  maxSize: 10,
  cleanupInterval: 30 * 1000
});

export const portfolioCache = new DataCache<any>({
  ttl: 1 * 60 * 1000, // 1 minute for portfolios
  maxSize: 1000,
  cleanupInterval: 30 * 1000
});

export const stakesCache = new DataCache<any[]>({
  ttl: 30 * 1000, // 30 seconds for stakes
  maxSize: 1000,
  cleanupInterval: 15 * 1000
});

export const systemInfoCache = new DataCache<any>({
  ttl: 5 * 60 * 1000, // 5 minutes for system info
  maxSize: 1,
  cleanupInterval: 60 * 1000
});

// Cache key generators
export const cacheKeys = {
  pools: () => 'pools',
  portfolio: (userId: string) => `portfolio:${userId}`,
  userStakes: (userId: string) => `stakes:${userId}`,
  pool: (poolId: string) => `pool:${poolId}`,
  stake: (stakeId: number) => `stake:${stakeId}`,
  systemInfo: () => 'system:info',
  whoami: (principal: string) => `whoami:${principal}`
};

// Cache invalidation patterns
export const cachePatterns = {
  allPools: 'pool',
  allPortfolios: 'portfolio',
  allStakes: 'stakes',
  allSystem: 'system'
};
