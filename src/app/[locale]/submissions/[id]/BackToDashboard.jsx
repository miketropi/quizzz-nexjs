'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function BackToDashboard() {
  const t = useTranslations();
  const { locale } = useParams();
  
  return (
    <div className="mb-6">
      <Link 
        href={`/${locale}/dashboard`} 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('submission.backToDashboard', 'Back to Dashboard')}
      </Link>
    </div>
  );
}
