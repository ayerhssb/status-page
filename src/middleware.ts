// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// All public routes — adjust as needed
const isPublicRoute = createRouteMatcher([
  '/', // Let this pass, and redirect it inside your page
  '/status/:path*',
  '/api/status/:path*',
  '/api/webhook/:path*',
  '/sign-in(.*)', // Clerk internal routing
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Any route not marked public requires login
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next|favicon.ico).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
