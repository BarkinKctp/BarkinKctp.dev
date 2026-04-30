const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 3; // max 3 emails per minute per IP

const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string): {
  success: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = requests.get(identifier);

  // Clean up expired entries periodically
  if (requests.size > 1000) {
    for (const [key, value] of requests) {
      if (now > value.resetTime) {
        requests.delete(key);
      }
    }
  }

  if (!entry || now > entry.resetTime) {
    requests.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}
