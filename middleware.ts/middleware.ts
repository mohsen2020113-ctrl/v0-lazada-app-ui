import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // For admin routes: detect and log requests from proxy/VPN indicators
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const suspiciousHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'cf-connecting-ip',
      'true-client-ip',
    ];

    const proxyHeaders: Record<string, string> = {};
    suspiciousHeaders.forEach((h) => {
      const val = request.headers.get(h);
      if (val) proxyHeaders[h] = val;
    });

    const proxyCount = Object.keys(proxyHeaders).length;
    if (proxyCount >= 2) {
      console.warn('[SECURITY] Possible VPN/proxy admin access:', JSON.stringify(proxyHeaders));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
