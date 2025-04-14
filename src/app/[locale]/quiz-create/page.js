'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import QuizGeneratorForm from '@/components/QuizGeneratorForm';
import QuizReview from '@/components/QuizReview';

export default function QuizCreate() {
  const [isClient, setIsClient] = useState(false)

  const t = useTranslations('quizCreate'); 
  const router = useRouter();
  const { quiz, isGenerating, error, saveQuiz } = useQuizStore();  
  
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
      
      {quiz && quiz.questions && quiz.questions.length > 0 && (
        <QuizReview quiz={quiz} saveQuiz={saveQuiz} />
      )}
    </div>
  );
}
