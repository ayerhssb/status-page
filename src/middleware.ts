// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Include ALL public routes
const isPublicRoute = createRouteMatcher([
  '/status/:path*',
  '/api/status/:path*',
  '/api/webhook/:path*',
  '/sign-in/:path*', // Include all sign-in routes including the Clerk catchall checks
  '/sign-up/:path*',
  // Other auth-related paths Clerk might use
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const path = req.nextUrl.pathname;

  // Special case for home route
  if (path === '/') {
    if (userId) {
      // User is logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      // User is not logged in, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // Allow public routes without auth checks
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For protected routes, check if user is signed in
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // User is authenticated, allow access to protected routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!.*\\..*|_next).*)', 
    '/',
    '/(api|trpc)(.*)'
  ],
};