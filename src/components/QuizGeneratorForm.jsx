"use client";

import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store';
import { useTranslations, useLocale } from 'next-intl';
import { Bot } from 'lucide-react';
export default function QuizGeneratorForm() {
  const t = useTranslations('quizForm');
  const locale = useLocale();
  const router = useRouter();
  const prompt = useQuizStore(state => state.prompt);
  const setPrompt = useQuizStore(state => state.setPrompt);
  const isGenerating = useQuizStore(state => state.isGenerating);
  const generateQuiz = useQuizStore(state => state.generateQuiz);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Generate the quiz using our store
    await generateQuiz();
    
    // Navigate to the quiz page with locale
    router.push(`/${locale}/quiz-create`);
  };

  return (
    <form onSubmit={handleGenerateQuiz} className="w-full mx-auto">
      <div className="mb-4">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 
                   text-gray-800 dark:text-white dark:border-gray-700
                   bg-white dark:bg-gray-800 shadow-sm
                   placeholder:text-gray-500 dark:placeholder:text-gray-400
                   focus:border-blue-500 dark:focus:border-blue-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30
                   transition-colors duration-200"
          required
          rows={4}
          style={{ resize: "vertical" }}
        ></textarea>
      </div>
      <div className="flex justify-center sm:justify-end">
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 
                   text-white font-medium px-6 py-3 
                   transition-colors duration-200 
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50
                   disabled:opacity-70 disabled:cursor-not-allowed
                   shadow-sm hover:shadow-md cursor-pointer"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{t('generating') || 'Generating...'}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Bot className="mr-2 h-5 w-5" />
              { t('title') }
            </div>
          )}
        </button>
      </div>
    </form>
  );
} 