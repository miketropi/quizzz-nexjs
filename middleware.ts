import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define supported locales
const locales = ['en', 'fr', 'es', 'vi'];
const defaultLocale = 'vi';

// Create a function that wraps the intl middleware and adds API protection
function middleware(request: NextRequest) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Get the origin of the request
    const origin = request.headers.get('origin') || '';
    
    const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [];

    // If the origin is not in our allowed list, block the request
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }
  }
  
  // For non-API routes, use the intl middleware
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
  });
  
  return intlMiddleware(request);
}

export default middleware;

export const config = {
  // Match all pathnames except static files
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
}; 