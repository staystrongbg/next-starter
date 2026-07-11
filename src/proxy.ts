import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/profile'];
const authRoutes = ['/sign-in', '/sign-up', '/reset-password'];

export async function proxy(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Handle reset password token validation
    if (url.pathname === '/reset-password') {
      const token = url.searchParams.get('token');
      if (!token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.user;
    const { pathname } = request.nextUrl;

    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL('/sign-in?redirect=' + encodeURIComponent(pathname), request.url),
      );
    }

    return NextResponse.next();
  } catch (error) {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile', '/sign-in', '/sign-up', '/reset-password'],
};
