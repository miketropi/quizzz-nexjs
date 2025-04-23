import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import submittedService from '@/services/submittedService';
import { Clock, User, Award, Percent, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Server-side rendering
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const submission = await submittedService.getSubmissionById(id);
    if (!submission) {
      return {
        title: 'Submission Not Found',
      };
    }

    // console.log('submission', submission);

    return {
      title: `Quiz Result: ${submission.result?.quizData?.title || 'Quiz'}`,
      description: `View your submission results for ${submission.result?.quizData?.title || 'quiz'}.`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Quiz Submission',
      description: 'View your quiz submission results',
    };
  }
}

export default async function SubmissionPage({ params }) {
  const { id, locale } = await params;
  const t = await getTranslations({
    locale,
  });
  try {
    const submission = await submittedService.getSubmissionById(id);
    if (!submission) {
      notFound();
    }

    // console.log('submission', submission);
    // get user info
    let rootUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const userInfo = await fetch(`${ rootUrl }/api/v1/user/${submission.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    // console.log('user', userInfo);

    return <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href={`/${locale}/dashboard`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('submission.backToDashboard', 'Back to Dashboard')}
          </Link>
        </div>

        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {submission.result?.quizData?.title || 'Quiz Results'}
          </h1>
          <p className="text-gray-600 mb-4">
            {submission.result?.quizData?.description || 'Quiz submission details'}
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <Award className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-500">{t('submission.score', 'Score')}</p>
              <p className="text-xl font-bold text-blue-600">{submission.result?.score || 0}%</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
              <CheckCircle2 className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-gray-500">{t('submission.correct', 'Correct')}</p>
              <p className="text-xl font-bold text-green-600">
                {submission.result?.correctAnswers || 0}/{submission.result?.totalQuestions || 0}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center">
              <Clock className="text-purple-600 mb-2" size={24} />
              <p className="text-sm text-gray-500">{t('submission.submitted', 'Submitted')}</p>
              <p className="text-xl font-bold text-purple-600">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg flex flex-col items-center">
              <User className="text-orange-600 mb-2" size={24} />
              <p className="text-sm text-gray-500">{t('submission.user', 'User')}</p>
              <div className="text-xl font-bold text-orange-600 truncate max-w-full">
                {/* {submission.userId?.substring(0, 8) || 'Anonymous'} */}
                {/** show avatar & user displayName or email */}
                <div className="flex items-center space-x-2">
                  {
                    userInfo.photoURL? (
                      <img
                        src={userInfo.photoURL}
                        alt={`avatar`}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                          {userInfo.displayName?.charAt(0) || userInfo.email?.charAt(0)}
                        </span>
                      </div>
                    )
                  }
                  <span className="truncate" title={ userInfo.email }>
                    {userInfo.displayName || userInfo.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Questions and Answers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('submission.questions', 'Questions & Answers')}</h2>
          
          <div className="space-y-6">
            {submission.result?.quizData?.questions?.map((question, index) => {
              const userAnswer = submission.result?.userAnswers?.[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {index + 1}. {question.question}
                    </h3>
                    {isCorrect ? (
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-red-500 flex-shrink-0" size={24} />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {Object.entries(question.options).map(([key, value]) => {
                      const isUserAnswer = key === userAnswer;
                      const isCorrectAnswer = key === question.correctAnswer;
                      
                      let bgColor = "bg-gray-50";
                      if (isUserAnswer && isCorrectAnswer) bgColor = "bg-green-100";
                      else if (isUserAnswer && !isCorrectAnswer) bgColor = "bg-red-100";
                      else if (isCorrectAnswer) bgColor = "bg-green-50";
                      
                      return (
                        <div 
                          key={key} 
                          className={`${bgColor} p-3 rounded-md border ${
                            isUserAnswer ? 'border-blue-400' : 'border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      );
                    })}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md">
                      <span className="font-medium">{t('submission.explanation', 'Explanation')}:</span> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {t('submission.backToHome', 'Back to Home')}
          </a>
          
          <Link 
            href={`/${locale}/exam/${submission.quizId}`} 
            className="inline-flex items-center justify-center px-5 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
          >
            {t('submission.retakeQuiz', 'Retake Quiz')}
          </Link>
        </div>
      </div>
    </>
    
  } catch (error) {
    console.error('Error fetching submission:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t('submission.error', 'Error')}</h1>
        <p className="text-gray-600 mb-8">{t('submission.errorMessage', 'There was an error fetching the submission details.')}</p>
        <Link href="/" className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          {t('submission.backToHome', 'Back to Home')}
        </Link>
      </div>
    );
  }
}
