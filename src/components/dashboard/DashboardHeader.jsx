'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store';

export default function DashboardHeader() {
  const t = useTranslations();
  const { user } = useAuthStore();
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-3xl font-bold">{t('dashboard.title', 'Dashboard')}</h1>
        <p className="mt-2">{t('dashboard.welcome', 'Welcome back')}, {user?.email?.split('@')[0]}</p>
      </div>
    </div>
  );
} 