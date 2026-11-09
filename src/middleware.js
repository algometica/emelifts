import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((request) => {
  const { pathname } = request.nextUrl;
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
  matcher: ['/app', '/app/:path*', '/coach', '/coach/:path*'],
};
