'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Play, Trash, Edit, FileCheck, Eye, Loader2 } from 'lucide-react';
import { useConfirm } from '@/components/Confirm';
import { useState, useEffect, useRef, useCallback } from 'react';
import quizService from '@/services/quizService';
import { useAuthStore } from '@/store';
import submittedService from '@/services/submittedService';
import { useModal } from '@/components/Modal';

export default function QuizTable() { 
  const { user } = useAuthStore();
  const t = useTranslations();
  const locale = useLocale();
  const confirm = useConfirm();
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(25);
  const [lastQuiz, setLastQuiz] = useState(null);
  const loader = useRef(null);

  // fetch data quiz by user id
  const fetchQuizzes = async (loadMore = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await quizService.getQuizzesByUser(
        user.uid, 
        limit, 
        loadMore && lastQuiz ? lastQuiz : null
      );
      
      if (loadMore) {
        setQuizzes(prev => [...prev, ...res.quizzes]);
      } else {
        setQuizzes(res.quizzes);
      }
      
      if (res.quizzes.length > 0) {
        setLastQuiz(res.quizzes[res.quizzes.length - 1]);
      }
      
      setHasMore(res.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle intersection with the loading element
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading) {
      fetchQuizzes(true);
    }
  }, [hasMore, isLoading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    
    if (loader.current) observer.observe(loader.current);
    
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (quizzes.length === 0 && !isLoading) { 
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
                    <span className=" max-w-[250px] mb-2 font-bold">
                      {quiz.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/${locale}/exam/${quiz.id}`}
                        className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-1 border border-green-200"
                        aria-label={t('dashboard.takeExam', 'Take Exam')}
                        title={t('dashboard.takeExam', 'Take Exam')}
                      >
                        <span className="text-xs whitespace-nowrap">{t('dashboard.takeExam', 'Take Exam')}</span>
                        <Play className="w-4 h-4" />
                      </Link>
                      <SubmissionQuizModal quizId={quiz.id} />
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
        
        {/* Loading indicator and intersection observer target */}
        <div ref={loader} className="flex justify-center p-4">
          {isLoading && <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
          {!hasMore && quizzes.length > 0 && (
            <p className="text-sm text-gray-500">
              {t('dashboard.noMoreQuizzes', 'No more quizzes to load')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 

const SubmissionQuizModal = ({ quizId }) => {
  // get submission quiz by quiz id
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const locale = useLocale();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      const res = await submittedService.getSubmissions({ quizId });
      // console.log(res.length);
      // loop res and get user info from submissions
      // const submissionsWithUser = await Promise.all(res.map(async (submission) => {
      //   const user = await fetch(`/api/v1/user/${submission.userId}`).then(res => res.json());
      //   return { ...submission, userInfo: user };
      // }));
      // console.log(submissionsWithUser);
      setSubmissions(res);
      setIsLoading(false);

    }

    fetchSubmissions();
  }, [quizId]);

  const onOpenModal = () => {
    modal.open({
      title: 'Submissions',
      size: 'full',
      content: <div className="max-h-[70vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserInfo userId={submission.userId} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{submission.result.score}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{submission.result.correctAnswers}/{submission.result.totalQuestions}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(submission.submittedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => window.open(`/${locale}/submissions/${submission.id}`, '_blank')}
                    className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    });
  }

  return (
    <>
      {
        !isLoading && submissions?.length > 0 && (
          <button 
            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-1 border border-blue-200 cursor-pointer" 
            onClick={onOpenModal}
          >
            <span className="text-xs whitespace-nowrap">{ submissions?.length } { `submit` }</span>
            <FileCheck className="w-4 h-4" />
          </button>
        ) 
      }
      
    </>
  );
}

const UserInfo = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/v1/user/${userId}`).then(res => res.json());
      console.log(res);
      setUser(res);
      setIsLoading(false);
    }

    fetchUser();
  }, [userId]);

  return (
    <div>
      {
        isLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            {/** max string 5 character and add ... */}
            <span className="text-sm font-medium text-gray-900">{ userId.substring(0, 5) }...</span>
          </div>
        ) : (
          <>
            {/** avata and user email */}
            <div className="flex items-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || user.email} className="w-8 h-8 rounded-full mr-2" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="text-sm font-medium text-gray-900">
                {user.displayName || user.email}
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}