'use client';

import { useTranslations } from 'next-intl';

export default function FeaturesSection() {
  const t = useTranslations('features');
  
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('items.1.title'),
      description: t('items.1.description'),
      emoji: '⚡',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: t('items.2.title'),
      description: t('items.2.description'),
      emoji: '🧪',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('items.3.title'),
      description: t('items.3.description'),
      emoji: '🏆',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold text-center">{t('title')} ✨</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className={`mb-4 rounded-full ${feature.bgColor} p-2 ${feature.textColor} inline-block`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold flex items-center gap-2">
                {feature.emoji} {feature.title}
              </h3>
              <p className="text-gray-600 mb-3">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 