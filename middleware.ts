import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes that require authentication
  if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie) {
      // No session, redirect to login
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
      
      // Check if session is expired
      if (sessionData.exp < Date.now()) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('admin-session');
        return response;
      }

      // Check role-based access for admin routes
      if (sessionData.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }

    } catch {
      // Invalid session, redirect to login
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('admin-session');
      return response;
    }
  }

  // Controller routes
  if (pathname.startsWith('/controller')) {
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
      
      if (sessionData.exp < Date.now()) {
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('admin-session');
        return response;
      }

      if (sessionData.role !== 'controller') {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }

    } catch {
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('admin-session');
      return response;
    }
  }

  // Ambassador routes
  if (pathname.startsWith('/ambassador')) {
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
      
      if (sessionData.exp < Date.now()) {
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('admin-session');
        return response;
      }

      if (sessionData.role !== 'ambassador') {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }

    } catch {
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('admin-session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/controller/:path*', '/ambassador/:path*']
}; 