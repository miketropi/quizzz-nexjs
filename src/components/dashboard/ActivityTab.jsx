'use client';

import { useTranslations } from 'next-intl';

export default function ActivityTab() {
  const t = useTranslations();
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('dashboard.recentActivity', 'Recent Activity')}</h2>
      <p className="text-gray-500 text-center py-8">{t('dashboard.activityComingSoon', 'Activity tracking coming soon')}</p>
    </div>
  );
} 