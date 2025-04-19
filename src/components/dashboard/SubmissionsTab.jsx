'use client';

import { useTranslations, useLocale } from 'next-intl';
import { BarChart, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import submittedService from '@/services/submittedService';
import quizService from '@/services/quizService';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
export default function SubmissionsTab() {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        let userSubmissions = await submittedService.getSubmissionsByUser(user.uid);

        if(userSubmissions.length > 0) {
          userSubmissions = await Promise.all(userSubmissions.map(async (submission) => {
            // const quiz = await quizService.getQuizByRef(submission.quizRef);

            const quizData = submission.result.quizData;

            return {
              ...submission,
              quizTitle: quizData.title,
              quizData,
              score: submission.result.score,
            }
          }));
        }

        console.log(userSubmissions);
        setSubmissions(userSubmissions);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [user?.uid]);
  
  return (
    <div>
      {/* { JSON.stringify(submissions.map(async (submission) => {
        console.log(submission);
        
        // get quiz by ref
        const quiz = await quizService.getQuizByRef(submission.quizRef);
        console.log(quiz);
        return {
          quizTitle: quiz.title,
          score: submission.score,
          submittedAt: submission.submittedAt,
          id: submission.id,
        }
      })) } */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t('dashboard.yourSubmissions', 'Your Submissions')}</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BarChart className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.noSubmissions', 'No submissions yet')}</h3>
          <p className="text-gray-500 mb-6">{t('dashboard.tryQuiz', 'Try taking a quiz to see your results here')}</p>
        </div>
      ) : (
        <SubmissionsTable submissions={submissions} />
      )}
    </div>
  );
}

function SubmissionsTable({ submissions }) {
  const t = useTranslations();
  const locale = useLocale();
  
  return (
    <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.quizName', 'Quiz Name')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.score', 'Score')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.submittedAt', 'Submitted At')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('dashboard.actions', 'Actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission) => {
            return (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 w-1/2">
                  <div className="text-sm font-medium text-gray-900">
                    <Link href={`/${locale}/quizzes/${submission.quizRef.id}`} className="font-semibold hover:text-blue-600">
                      {submission.quizTitle || 'Unknown Quiz'}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {submission.score !== undefined ? `${submission.score}%` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {new Date(submission.submittedAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <a 
                    href={`/${locale}/submissions/${submission.id}`} 
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {t('dashboard.viewDetails', 'View Details')}
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
