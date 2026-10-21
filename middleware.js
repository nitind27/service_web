import { NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'allservice_auth_token';

// Simple JWT payload parser that runs cleanly in Edge middleware
function parseJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const isUserRoute = pathname.startsWith('/user');
  const isProviderRoute = pathname.startsWith('/provider');
  const isSubAdminRoute = pathname.startsWith('/subadmin');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isUserRoute && !isProviderRoute && !isSubAdminRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get(TOKEN_COOKIE_NAME);
  const token = tokenCookie ? tokenCookie.value : null;
  const user = token ? parseJwtPayload(token) : null;

  // Not logged in -> Redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = user.role; // 'admin', 'subadmin', 'provider', 'customer'

  // Admin route check
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_admin', request.url));
  }

  // SubAdmin route check
  if (isSubAdminRoute && role !== 'subadmin' && role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_subadmin', request.url));
  }

  // Provider route check
  if (isProviderRoute && role !== 'provider' && role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=unauthorized_provider', request.url));
  }

  // User route check
  if (isUserRoute && !['customer', 'provider', 'subadmin', 'admin'].includes(role)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/:path*',
    '/provider/:path*',
    '/subadmin/:path*',
    '/admin/:path*',
  ],
};
