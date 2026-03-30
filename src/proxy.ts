import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Handle reset password token validation
    if (url.pathname === '/reset-password') {
      const token = url.searchParams.get('token');
      if (!token) {
        // No token provided, redirect to not found
        return NextResponse.redirect(new URL('/not-found', request.url));
      }
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.user;
    const { pathname } = request.nextUrl;

    // If authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && (pathname === '/sign-in' || pathname === '/sign-up')) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error);
    }
    // Continue with request to avoid breaking the app
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/reset-password'],
};
