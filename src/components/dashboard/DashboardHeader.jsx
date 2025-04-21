'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store';

export default function DashboardHeader() {
  const t = useTranslations();
  const { user } = useAuthStore();
  // console.log('user', user);
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-0">
            {t('dashboard.welcomeBack', 'Welcome back')}, {user?.displayName || t('dashboard.user', 'User')}!
          </h1>
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || t('dashboard.userAvatar', 'User avatar')} 
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center border-2 border-white">
                <span className="text-blue-800 font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 