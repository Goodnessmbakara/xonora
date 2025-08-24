/**
 * Rate limiting utilities for Xonora backend service
 * Provides protection against abuse and ensures fair usage
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  perUser: boolean; // Whether to track per user or globally
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Timestamp when the limit resets
  retryAfter?: number; // Seconds to wait before retry
}

export interface RateLimitResult {
  allowed: boolean;
  info: RateLimitInfo;
  retryAfter?: number;
}

export class RateLimiter {
  private requests = new Map<string, number[]>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    };
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string, operation: string): RateLimitResult {
    const key = this.config.perUser ? `${identifier}:${operation}` : operation;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this key
    const requests = this.requests.get(key) || [];
    
    // Filter requests within the current window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Update requests for this key
    this.requests.set(key, recentRequests);

    const remaining = Math.max(0, this.config.maxRequests - recentRequests.length);
    const reset = now + this.config.windowMs;
    const allowed = recentRequests.length < this.config.maxRequests;

    const info: RateLimitInfo = {
      limit: this.config.maxRequests,
      remaining,
      reset
    };

    if (!allowed) {
      const oldestRequest = Math.min(...recentRequests);
      const retryAfter = Math.ceil((oldestRequest + this.config.windowMs - now) / 1000);
      info.retryAfter = retryAfter;
    }

    return {
      allowed,
      info,
      retryAfter: info.retryAfter
    };
  }

  /**
   * Record a request
   */
  recordRequest(identifier: string, operation: string, success: boolean = true): void {
    // Skip recording based on config
    if (success && this.config.skipSuccessfulRequests) {
      return;
    }
    if (!success && this.config.skipFailedRequests) {
      return;
    }

    const key = this.config.perUser ? `${identifier}:${operation}` : operation;
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    requests.push(now);
    this.requests.set(key, requests);
  }

  /**
   * Get rate limit info without recording request
   */
  getInfo(identifier: string, operation: string): RateLimitInfo {
    const key = this.config.perUser ? `${identifier}:${operation}` : operation;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    const remaining = Math.max(0, this.config.maxRequests - recentRequests.length);
    const reset = now + this.config.windowMs;

    return {
      limit: this.config.maxRequests,
      remaining,
      reset
    };
  }

  /**
   * Reset rate limit for specific identifier and operation
   */
  reset(identifier: string, operation: string): void {
    const key = this.config.perUser ? `${identifier}:${operation}` : operation;
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.requests.clear();
  }

  /**
   * Get statistics
   */
  getStats(): Record<string, any> {
    const stats: Record<string, any> = {
      totalKeys: this.requests.size,
      config: this.config
    };

    // Count requests per key
    const keyStats: Record<string, number> = {};
    for (const [key, requests] of this.requests.entries()) {
      keyStats[key] = requests.length;
    }
    stats.keyStats = keyStats;

    return stats;
  }

  /**
   * Clean up old entries
   */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

// Pre-configured rate limiters for different operations
export const rateLimiters = {
  // Staking operations - 10 requests per minute per user
  stake: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    perUser: true,
    skipFailedRequests: true
  }),

  // Unstaking operations - 5 requests per minute per user
  unstake: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    perUser: true,
    skipFailedRequests: true
  }),

  // Query operations - 100 requests per minute per user
  query: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    perUser: true,
    skipSuccessfulRequests: true
  }),

  // Authentication operations - 5 requests per minute per user
  auth: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    perUser: true,
    skipSuccessfulRequests: true
  }),

  // Global rate limit - 1000 requests per minute across all users
  global: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000,
    perUser: false,
    skipSuccessfulRequests: true
  })
};

// Rate limiting decorator
export function rateLimit(limiterKey: keyof typeof rateLimiters, operation?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const limiter = rateLimiters[limiterKey];

    descriptor.value = async function (...args: any[]) {
      // Get user identifier (assuming first argument is userId or principal)
      const userId = args[0] || 'anonymous';
      const opName = operation || `${target.constructor.name}.${propertyName}`;

      // Check rate limit
      const rateLimitResult = limiter.isAllowed(userId, opName);
      
      if (!rateLimitResult.allowed) {
        const error = new Error(`Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`);
        (error as any).rateLimitInfo = rateLimitResult.info;
        throw error;
      }

      // Record the request
      limiter.recordRequest(userId, opName, true);

      try {
        const result = await method.apply(this, args);
        return result;
      } catch (error) {
        // Record failed request
        limiter.recordRequest(userId, opName, false);
        throw error;
      }
    };

    return descriptor;
  };
}

// Export commonly used functions
export const isAllowed = (limiter: RateLimiter, identifier: string, operation: string) => 
  limiter.isAllowed(identifier, operation);

export const recordRequest = (limiter: RateLimiter, identifier: string, operation: string, success: boolean) => 
  limiter.recordRequest(identifier, operation, success);

export const getInfo = (limiter: RateLimiter, identifier: string, operation: string) => 
  limiter.getInfo(identifier, operation);
