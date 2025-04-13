'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { RefreshCcw, MousePointerClick } from 'lucide-react';
import QuizGeneratorForm from '@/components/QuizGeneratorForm';

export default function QuizCreate() {
  const [isClient, setIsClient] = useState(false)

  const t = useTranslations('quizCreate'); 
  const router = useRouter();
  const { quiz, isGenerating, error } = useQuizStore();  
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="container mx-auto my-10 p-4 md:w-9/12 w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Quiz Create</h1>
      {/** add some decsript for this page */} 
      { isClient && <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: t.raw('description') }} /> }

      <div className="my-8">
        <QuizGeneratorForm />
      </div>

      { isGenerating && <p>Generating quiz...</p> }
      { error && <p>Error: {error}</p> }
      {/* { quiz && <p>Quiz generated: {quiz.title}</p> } */}
      
      {quiz && quiz.questions && quiz.questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 my-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{quiz.title} ({quiz.questions.length} { t('questions') })</h2>
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
                          disabled
                          checked={key === question.correctAnswer}
                        />
                      </div>
                      <label 
                        htmlFor={`${question.id}-${key}`} 
                        className={`ml-2 block text-sm ${key === question.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-700'}`}
                      >
                        <span className="font-medium">{key}:</span> {value}
                      </label> 
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-sm">
                    <div className="text-blue-600 font-medium mb-2">
                      { t('explanation') }
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  </div> 
                </div>
              </div> 
            ))}
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg p-4 border-t border-gray-200 z-50">
            <div className="container mx-auto max-w-[900px] flex flex-col sm:flex-row justify-between gap-3">
              <button 
                type="button"
                onClick={ e => {
                  e.preventDefault();

                  // scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } }
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer text-xs"
                aria-label="Create another quiz"
              >
                <span className="mr-2">
                  <RefreshCcw className="w-4 h-4" />
                </span>
                { t('createAnotherQuiz') }
              </button>

              <button 
                type="button"
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer text-xs"
                aria-label="Use this quiz data"  
              >
                <span className="mr-2">
                  <MousePointerClick className="w-4 h-4" />
                </span>
                { t('useThisQuizData') }
              </button>
            </div>
          </div>
          <div className="pb-24">
            {/* Spacer to prevent content from being hidden behind the fixed footer */}
          </div>
        </div>
      )}
    </div>
  );
}
