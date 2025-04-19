'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuthStore } from '../store';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, loading, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href={`/${locale}`} className="text-xl font-bold flex items-center">
            {t('app.title')}
            <sup className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full">Beta</sup>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li><Link href={`/${locale}`} className="text-sm hover:text-blue-600 transition-colors">{t('nav.home')}</Link></li>
            <li><Link href={`/${locale}/about`} className="text-sm hover:text-blue-600 transition-colors">{t('nav.about')}</Link></li>
            {/* <li><Link href={`/${locale}/quizzes`} className="text-sm hover:text-blue-600 transition-colors">{t('nav.quizzes')}</Link></li> */}
            
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* <li>
                      <Link 
                        href={`/${locale}/dashboard`} 
                        className="text-sm hover:text-blue-600 transition-colors flex items-center"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-1" />
                        Dashboard
                      </Link>
                    </li> */}
                    <li className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all flex items-center shadow-sm"
                      >
                        {`Hi, ${user.email.split('@')[0]}`}
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
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                              onClick={() => setShowDropdown(false)}
                            >
                              <User className="w-4 h-4 mr-2" />
                              Dashboard
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              {t('nav.logout') || 'Logout'}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href={`/${locale}/login`} className="text-sm hover:text-blue-600 transition-colors">
                        {t('nav.login')}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/signup`} className="text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
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
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
          <nav>
            <ul className="flex flex-col space-y-4">
              <li><Link href={`/${locale}`} className="block text-sm py-2 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link></li>
              <li><Link href={`/${locale}/about`} className="block text-sm py-2 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</Link></li>
              <li><Link href={`/${locale}/quizzes`} className="block text-sm py-2 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.quizzes')}</Link></li>
              
              {!loading && (
                <>
                  {user ? (
                    <>
                      <li className="pt-2 border-t border-gray-100">
                        <Link 
                          href={`/${locale}/dashboard`} 
                          className="block text-sm py-2 hover:text-blue-600 transition-colors flex items-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left text-sm py-2 hover:text-blue-600 transition-colors flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('nav.logout') || 'Logout'}
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="pt-2 border-t border-gray-100">
                        <Link 
                          href={`/${locale}/login`} 
                          className="block text-sm py-2 hover:text-blue-600 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('nav.login')}
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href={`/${locale}/signup`} 
                          className="block text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm mt-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
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
      )}
    </header>
  );
} 