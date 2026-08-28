import { NextRequest, NextResponse } from 'next/server';

import { auth } from './lib/auth';

const protectedRoutes = ['/profile'];
const authRoutes = ['/sign-in', '/sign-up', '/reset-password'];

export async function proxy(request: NextRequest) {
  try {
    const { pathname, searchParams } = request.nextUrl;

    // Handle reset password token validation – redirect, do not throw
    if (pathname === '/reset-password') {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      // If no token and no error param, assume direct navigation without flow
      if (!token && !error) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }

    // Use Better Auth session via request headers (edge/middleware-safe).
    // Do NOT import requireUserSession (uses next/headers – RSC only).
    let session: { user?: unknown } | null = null;
    try {
      session = await auth.api.getSession({
        headers: request.headers,
      });
    } catch {
      // Treat session fetch failures as unauthenticated – redirect handled below
      session = null;
    }

    const isAuthenticated = !!session?.user;

    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL('/sign-in?redirect=' + encodeURIComponent(pathname), request.url),
      );
    }

    // Optionally protect verify-email: redirect authenticated + verified users away?
    // Currently allow all; Better Auth handles token validation server-side.

    return NextResponse.next();
  } catch (error) {
    // Log error in development but never throw from middleware – fail open to avoid lockout
    if (process.env.NODE_ENV === 'development') {
      console.error('Proxy error:', error);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/sign-in',
    '/sign-up',
    '/reset-password',
    '/verify-email/:path*',
  ],
};
