// src/middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protéger la messagerie
    if (path.startsWith('/messages') && !token) {
      return NextResponse.redirect(new URL('/connexion', req.url));
    }

    // Protéger le dashboard
    if (path.startsWith('/dashboard') && !token) {
      return NextResponse.redirect(new URL('/connexion', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Configurer les routes protégées
export const config = {
  matcher: [
    '/messages/:path*',
    '/dashboard',
    '/club/dashboard',
    '/admin/validations',
    '/mon-compte/:path*',
    '/api/protected/:path*'
  ]
};