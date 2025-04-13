'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, loading } = useAuth();
  
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href={`/${locale}`} className="text-xl font-bold flex items-center">
            {t('app.title')}
            {/** beta tag */}
            <sup className="text-xs text-gray-500 ml-2 bg-blue-500 text-white px-2 py-1 rounded-full">Beta</sup>
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href={`/${locale}`} className="text-sm hover:text-blue-600">{t('nav.home')}</Link></li>
            <li><Link href={`/${locale}/about`} className="text-sm hover:text-blue-600">{t('nav.about')}</Link></li>
            <li><Link href={`/${locale}/quizzes`} className="text-sm hover:text-blue-600">{t('nav.quizzes')}</Link></li>
            
            {!loading && (
              <>
                {user ? (
                  <li>
                    <Link href={`/${locale}/profile`} className="text-sm font-medium bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
                      {t('nav.profile')}
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link href={`/${locale}/login`} className="text-sm hover:text-blue-600">
                        {t('nav.login')}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/signup`} className="text-sm font-medium bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
                        {t('nav.signup')}
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
} 