// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Redirect logged-in users from login/signup to dashboard
    if ((pathname === '/login' || pathname === '/signup') && token) {
      return NextResponse.redirect(new URL(getDashboardPath(token.role as string), req.url));
    }

    // Redirect root to appropriate dashboard for logged-in users
    if (pathname === '/' && token) {
      return NextResponse.redirect(new URL(getDashboardPath(token.role as string), req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes - no auth required
        if (['/', '/login', '/signup', '/businesses', '/api/auth'].includes(pathname)) {
          return true;
        }

        // Protected routes require authentication
        if (!token) return false;

        // Role-based access control
        if (pathname.startsWith('/usersdashboard') && token.role !== 'USER' && token.role !== 'ADMIN') {
          return false;
        }

        if (pathname.startsWith('/business/dashboard') && token.role !== 'BUSINESS' && token.role !== 'ADMIN') {
          return false;
        }

        if (pathname.startsWith('/botswanaservices') && token.role !== 'ADMIN') {
          return false;
        }

        return true;
      },
    },
  }
);

function getDashboardPath(role: string): string {
  switch (role) {
      case 'BUSINESS':
        return '/business';
    case 'ADMIN':
      return '/botswanaservices';
    case 'USER':
      return '/usersdashboard';
    default:
      return '/';
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};