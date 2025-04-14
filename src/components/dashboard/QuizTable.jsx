'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Eye, Trash } from 'lucide-react';

export default function QuizTable({ quizzes, handleDeleteQuiz }) {
  const t = useTranslations();
  const locale = useLocale();
  
  if (quizzes.length === 0) {
    return null;
  }
  
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.quizTitle', 'Quiz Title')}
            </th>
            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.description', 'Description')}
            </th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.questions', 'Questions')}
            </th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.date', 'Created')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <tr key={quiz.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 align-top">
                <div className="flex flex-col">
                  <span className=" max-w-[200px] mb-2 font-bold">{quiz.title}</span>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/${locale}/quiz/${quiz.id}`}
                      className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                      aria-label={t('dashboard.view', 'View Quiz')}
                      title={t('dashboard.view', 'View Quiz')}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                      aria-label={t('dashboard.delete', 'Delete')}
                      title={t('dashboard.delete', 'Delete')}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500 align-top">
                <p className="max-w-[200px] text-sm">
                  {quiz.description?.length > 50 
                    ? `${quiz.description.substring(0, 50)}...` 
                    : quiz.description}
                </p>
              </td>
              <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                {quiz.questions?.length}
              </td>
              <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                {new Date(quiz.createdAt?.toDate()).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 