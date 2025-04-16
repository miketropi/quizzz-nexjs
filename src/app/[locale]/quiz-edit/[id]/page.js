'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { useQuizStore } from '@/store';
import quizService from '@/services/quizService';
import QuizReview from '@/components/QuizReview';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/components/Toast';
import { use } from 'react';

export default function QuizEditPage({ params }) {
  const t = useTranslations('quizCreate');
  const router = useRouter();
  const locale = useLocale();
  const toast = useToast();
  const { id } = use(params);
  
  // Local state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  
  // Get the updateQuiz function from the store
  const { updateQuiz } = useQuizStore();

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await quizService.getQuizById(id);
      
      if (!quizData) {
        setError('Quiz not found');
      } else {
        setQuiz(quizData);
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Failed to load quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleUpdateQuiz = async (updatedQuiz) => {
    try {
      // updateQuiz(updatedQuiz);
      await quizService.updateQuiz(id, updatedQuiz);
      setQuiz(updatedQuiz);
      // toast.success(t('quizUpdatedSuccessfully'), 3000);
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error(t('quizUpdateFailed'), 3000);
    }
  };

  const handleSaveQuiz = async (editedQuiz = null) => {
    try {
      const quizToSave = editedQuiz || quiz;
      await quizService.updateQuiz(id, quizToSave);
      toast.success(t('quizSavedSuccessfully'), 3000);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(t('quizSaveFailed'), 3000);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto my-10 p-4 md:w-9/12 w-full max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToDashboard')}
          </button>
          <h1 className="text-2xl font-bold mt-4">{t('editQuiz')}</h1>
        </div>

        {loading && <div className="text-center py-10">Loading quiz data...</div>}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {quiz && !loading && !error && (
          <QuizReview 
            quiz={quiz} 
            updateQuiz={handleUpdateQuiz} 
            saveQuiz={handleSaveQuiz}
            mode="edit"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
