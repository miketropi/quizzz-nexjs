'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Play, Trash, Edit } from 'lucide-react';
import { useConfirm } from '@/components/Confirm';
import { useState, useEffect } from 'react';
import quizService from '@/services/quizService';
import { useAuthStore } from '@/store';

export default function QuizTable() {
  const { user } = useAuthStore();
  const t = useTranslations();
  const locale = useLocale();
  const confirm = useConfirm();
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  // fetch data quiz by user id
  const fetchQuizzes = async () => {
    const quizzes = await quizService.getQuizzesByUser(user.uid);
    setQuizzes(quizzes);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (quizzes.length === 0) {
    return null;
  }

  const formatTime = (seconds) => {
    if (seconds === null) return t('dashboard.noLimit', 'No limit');
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuizzes(quizzes.map(quiz => quiz.id));
    } else {
      setSelectedQuizzes([]);
    }
  };

  const handleSelectQuiz = (id) => {
    setSelectedQuizzes(prev => {
      if (prev.includes(id)) {
        return prev.filter(quizId => quizId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDeleteQuiz = async (quizId) => {
    const result = await confirm({
      title: 'Delete Quiz',
      message: 'Are you sure you want to delete this quiz?',
    });
    if (result) {
      try {
        await quizService.deleteQuiz(quizId);
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  // handle update status of quiz
  const handleUpdateStatus = async (quizId, status) => {
    console.log(quizId, status);
    try {
      await quizService.updateQuizStatus(quizId, status);
      fetchQuizzes();
    } catch (error) {
      console.error('Error updating quiz status:', error);
    }
  };

  const handleBulkDelete = () => {
    const result = confirm({
      title: t('dashboard.confirmBulkDelete', 'Delete Selected Quizzes'),
      description: t('dashboard.confirmBulkDeleteDesc', 'Are you sure you want to delete these quizzes? This action cannot be undone.')
    });

    if (result) {
      selectedQuizzes.forEach(id => handleDeleteQuiz(id));
      setSelectedQuizzes([]);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    const result = await confirm({
      title: t('dashboard.confirmBulkStatusUpdate', 'Update Status'),
      description: t('dashboard.confirmBulkStatusUpdateDesc', 'Are you sure you want to update the status of these quizzes?'),
    });

    if (result) {
      selectedQuizzes.forEach(id => handleUpdateStatus(id, status));
    }
  };
  
  return (
    <div>
      {selectedQuizzes.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap gap-2">
          <button 
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium border border-red-200"
          >
            {t('dashboard.deleteSelected', 'Delete Selected')} ({selectedQuizzes.length})
          </button>
          <button 
            onClick={() => handleBulkStatusUpdate('public')}
            className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium border border-green-200"
          >
            {t('dashboard.makePublic', 'Make Public')}
          </button>
          <button 
            onClick={() => handleBulkStatusUpdate('private')}
            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium border border-blue-200"
          >
            {t('dashboard.makePrivate', 'Make Private')}
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={selectedQuizzes.length === quizzes.length && quizzes.length > 0}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dashboard.quizTitle', 'Quiz Title')}
              </th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dashboard.description', 'Description')}
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dashboard.questions', 'Questions')}
              </th>
              <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dashboard.status', 'Status')}
              </th>
              <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dashboard.timeLimit', 'Time Limit')}
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dashboard.date', 'Created')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={selectedQuizzes.includes(quiz.id)}
                      onChange={() => handleSelectQuiz(quiz.id)}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 align-top">
                  <div className="flex flex-col">
                    <span className=" max-w-[200px] mb-2 font-bold">{quiz.title} - {quiz.id}</span>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/${locale}/exam/${quiz.id}`}
                        className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-1 border border-green-200"
                        aria-label={t('dashboard.takeExam', 'Take Exam')}
                        title={t('dashboard.takeExam', 'Take Exam')}
                      >
                        <span className="text-xs">{t('dashboard.takeExam', 'Take Exam')}</span>
                        <Play className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/${locale}/quiz-edit/${quiz.id}`}
                        className="p-1.5 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200 flex items-center justify-center"
                        aria-label={t('dashboard.edit', 'Edit Quiz')}
                        title={t('dashboard.edit', 'Edit Quiz')}
                      >
                        <Edit className="w-4 h-4" />
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
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm align-top">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    quiz.status === 'public' ? 'bg-green-100 text-green-800' : 
                    quiz.status === 'private' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quiz.status || 'draft'}
                  </span>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                  {formatTime(quiz.limitTime)}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                  {new Date(quiz.createdAt?.toDate()).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 