import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname === '/reset-password') {
    const token = url.searchParams.get('token');
    if (!token) {
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
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/reset-password'],
};
//
