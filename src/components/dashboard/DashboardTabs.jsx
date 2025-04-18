'use client';

import { BookOpen, Clock, User, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const t = useTranslations();
  
  const tabs = [
    {
      id: 'quizzes',
      icon: <BookOpen className="w-4 h-4 inline mr-2" />,
      label: t('dashboard.tabs.quizzes', 'My Quizzes')
    },
    {
      id: 'submissions',
      icon: <Clock className="w-4 h-4 inline mr-2" />,
      label: t('dashboard.tabs.submissions', 'Submissions')
    },
    {
      id: 'activity',
      icon: <Clock className="w-4 h-4 inline mr-2" />,
      label: t('dashboard.tabs.activity', 'Activity')
    },
    {
      id: 'profile',
      icon: <User className="w-4 h-4 inline mr-2" />,
      label: t('dashboard.tabs.profile', 'Profile')
    },
    {
      id: 'settings',
      icon: <Settings className="w-4 h-4 inline mr-2" />,
      label: t('dashboard.tabs.settings', 'Settings')
    }
  ];
  
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex flex-wrap overflow-x-auto -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 md:py-4 md:px-6 text-sm font-medium whitespace-nowrap flex items-center ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.id === activeTab ? tab.label : ''}</span>
          </button>
        ))}
      </nav>
    </div>
  );
} 