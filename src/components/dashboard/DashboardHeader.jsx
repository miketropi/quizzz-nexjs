'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store';

export default function DashboardHeader() {
  const t = useTranslations();
  const { user } = useAuthStore();
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-0">{t('dashboard.title', 'Dashboard')}</h1>
          <p className="text-sm sm:text-base">{t('dashboard.welcome', 'Welcome back')}, {user?.email?.split('@')[0]}</p>
        </div>
      </div>
    </div>
  );
} 