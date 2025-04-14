'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store';

export default function ProfileTab() {
  const t = useTranslations();
  const { user } = useAuthStore();
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('dashboard.profileInfo', 'Profile Information')}</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.email', 'Email')}</label>
          <p className="text-gray-900">{user?.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.userId', 'User ID')}</label>
          <p className="text-gray-900">{user?.uid}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.accountCreated', 'Account Created')}</label>
          <p className="text-gray-900">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '-'}</p>
        </div>
      </div>
    </div>
  );
} 