'use client';

import { BookOpen, Clock, User, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const t = useTranslations();
  
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'quizzes'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          {t('dashboard.tabs.quizzes', 'My Quizzes')}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'activity'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          {t('dashboard.tabs.activity', 'Activity')}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          {t('dashboard.tabs.profile', 'Profile')}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          {t('dashboard.tabs.settings', 'Settings')}
        </button>
      </nav>
    </div>
  );
} 