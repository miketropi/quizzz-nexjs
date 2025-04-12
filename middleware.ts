import createMiddleware from 'next-intl/middleware';

// Define supported locales
const locales = ['en', 'fr', 'es', 'vi'];
const defaultLocale = 'vi';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Make sure we always redirect if no locale is present
  localePrefix: 'always'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 