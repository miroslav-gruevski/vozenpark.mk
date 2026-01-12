// Simple in-memory rate limiter for API routes
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (cleared on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  // Maximum number of requests per window
  limit: number;
  // Time window in seconds
  windowSeconds: number;
}

// Default configs for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // Auth endpoints - stricter limits to prevent brute force
  auth: { limit: 5, windowSeconds: 60 },
  // General API endpoints
  api: { limit: 100, windowSeconds: 60 },
  // Strict limits for sensitive operations
  strict: { limit: 3, windowSeconds: 300 },
} as const;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
}

/**
 * Check if a request should be rate limited
 * @param key Unique identifier (e.g., IP address, user ID)
 * @param config Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically (simple garbage collection)
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries();
  }

  if (!entry || now > entry.resetTime) {
    // First request or window expired - create new entry
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.floor(resetTime / 1000),
    };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > config.limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: Math.floor(entry.resetTime / 1000),
    };
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: Math.floor(entry.resetTime / 1000),
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check common headers for client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP if there are multiple
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default (not ideal but prevents crashes)
  return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    ...(result.success ? {} : { 'Retry-After': Math.ceil((result.reset * 1000 - Date.now()) / 1000).toString() }),
  };
}

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Helper function to apply rate limiting to an API route
 */
export async function withRateLimit(
  request: Request,
  config: RateLimitConfig,
  handler: () => Promise<Response>
): Promise<Response> {
  const ip = getClientIP(request);
  const result = checkRateLimit(ip, config);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        message: 'Too many requests. Please try again later.',
        retryAfter: result.reset,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...getRateLimitHeaders(result),
        },
      }
    );
  }

  const response = await handler();
  
  // Add rate limit headers to successful response
  const headers = new Headers(response.headers);
  Object.entries(getRateLimitHeaders(result)).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
