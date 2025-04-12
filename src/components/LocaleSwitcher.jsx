'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  
  // Get the pathname without the locale prefix
  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr|es|vi)/, '') || '/';
  
  return (
    <div className="bg-gray-100 py-2">
      <div className="container mx-auto px-4 flex justify-end space-x-4">
        <Link 
          href={`/en${pathnameWithoutLocale}`} 
          className={`text-sm ${locale === 'en' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          English
        </Link>
        {/* <Link 
          href={`/fr${pathnameWithoutLocale}`} 
          className={`text-sm ${locale === 'fr' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Français
        </Link>
        <Link 
          href={`/es${pathnameWithoutLocale}`} 
          className={`text-sm ${locale === 'es' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Español
        </Link> */}
        <Link 
          href={`/vi${pathnameWithoutLocale}`} 
          className={`text-sm ${locale === 'vi' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Vietnamese
        </Link>
      </div>
    </div>
  );
} 