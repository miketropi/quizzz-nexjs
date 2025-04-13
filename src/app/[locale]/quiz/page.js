'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useQuizStore } from '@/store/useQuizStore';
export default function QuizPage() {
  const { quiz, isGenerating, error } = useQuizStore();
  const t = useTranslations('quiz');
  const locale = useLocale();
  
  return ( 
    <>
      <div className="container mx-auto px-4 py-8 max-w-[900px]">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
        <p className="mb-4">{t('loading')}</p> 
        
        <Link 
          href={`/${locale}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← {t('back')}
        </Link>

        {isGenerating ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
            <p>{error}</p>
          </div>
        ) : quiz?.questions?.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 my-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
              <p className="text-gray-600 mt-2">{quiz.description}</p>
            </div>
            
            <div className="space-y-8">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold mb-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    {question.question}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div key={key} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`${question.id}-${key}`}
                            name={`question-${question.id}`}
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                        </div>
                        <label htmlFor={`${question.id}-${key}`} className="ml-2 block text-sm text-gray-700">
                          <span className="font-medium">{key}:</span> {value}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <details className="text-sm">
                      <summary className="text-blue-600 cursor-pointer font-medium">
                        {t('showExplanation')}
                      </summary>
                      <div className="mt-2 bg-blue-50 p-3 rounded-md">
                        <p className="text-gray-700">{question.explanation}</p>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                {t('previous')}
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                {t('next')}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded my-4">
            <p>{t('noQuiz')}</p>
          </div>
        )}
      </div>
    </>
  );
} 