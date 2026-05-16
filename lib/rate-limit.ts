const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit({
    key,
    limit = 10,
    windowMs = 60_000,
  }: {
    key: string
    limit?: number
    windowMs?: number
  }): { success: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetAt) {
          rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
          return { success: true, remaining: limit - 1, resetAt: now + windowMs }
        }

    if (entry.count >= limit) {
          return { success: false, remaining: 0, resetAt: entry.resetAt }
        }

    entry.count += 1
    return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt }
  }

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
          const now = Date.now()
          for (const [key, entry] of rateLimitMap.entries()) {
                  if (now > entry.resetAt) rateLimitMap.delete(key)
                }
        }, 5 * 60_000)
  }
