import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import { clientIp, tooMany } from './lib/limit';

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const ip = clientIp(request);

  if (
    request.method === 'POST' &&
    (pathname.startsWith('/api/auth') || pathname === '/enroll' || pathname === '/login')
  ) {
    if (tooMany(`auth:${ip}`, 40, 60_000)) {
      return new NextResponse('Too many attempts. Wait a minute.', { status: 429 });
    }
  }

  const session = request.auth;

  if (pathname.startsWith('/app') || pathname.startsWith('/coach')) {
    if (!session?.user) {
      const login = new URL('/login', request.url);
      login.searchParams.set('next', pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname.startsWith('/coach') && session?.user?.role !== 'coach') {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/app', '/app/:path*', '/coach', '/coach/:path*', '/api/auth/:path*', '/enroll', '/login'],
};
