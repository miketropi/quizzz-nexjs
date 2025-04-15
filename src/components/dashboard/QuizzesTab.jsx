'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { PlusCircle, BookOpen } from 'lucide-react';
import QuizTable from './QuizTable';

export default function QuizzesTab({ userQuizzes }) {
  const t = useTranslations();
  const locale = useLocale();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t('dashboard.yourQuizzes', 'Your Quizzes')}</h2>
        <Link 
          href={`/${locale}/quiz-create`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('dashboard.createQuiz', 'Create Quiz')}
        </Link>
      </div>
      
      {userQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.noQuizzes', 'No quizzes yet')}</h3>
          <p className="text-gray-500 mb-6">{t('dashboard.startCreating', 'Start creating your first quiz')}</p>
          <Link 
            href={`/${locale}/quiz-create`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('dashboard.createQuiz', 'Create Quiz')}
          </Link>
        </div>
      ) : (
        <QuizTable 
          quizzes={userQuizzes}  />
      )}
    </div>
  );
} 