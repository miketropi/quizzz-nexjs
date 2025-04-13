'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuthStore } from '../store';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, loading, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
          <ul className="flex space-x-6 items-center">
            <li><Link href={`/${locale}`} className="text-sm hover:text-blue-600">{t('nav.home')}</Link></li>
            <li><Link href={`/${locale}/about`} className="text-sm hover:text-blue-600">{t('nav.about')}</Link></li>
            <li><Link href={`/${locale}/quizzes`} className="text-sm hover:text-blue-600">{t('nav.quizzes')}</Link></li>
            
            {!loading && (
              <>
                {user ? (
                  <li className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="text-sm font-medium bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      { `Hi, ${user.email}` }
                      <svg 
                        className={`ml-1 h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <Link 
                            href={`/${locale}/dashboard`} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                          >
                            {t('nav.logout') || 'Logout'}
                          </button>
                        </div>
                      </div>
                    )}
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