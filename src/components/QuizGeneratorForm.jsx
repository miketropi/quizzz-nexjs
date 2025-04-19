"use client";

import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store';
import { useTranslations, useLocale } from 'next-intl';
import { Bot, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useModal } from '@/components/Modal';

export default function QuizGeneratorForm() {
  const t = useTranslations('quizForm');
  const locale = useLocale();
  const router = useRouter();
  const prompt = useQuizStore(state => state.prompt);
  const setPrompt = useQuizStore(state => state.setPrompt);
  const isGenerating = useQuizStore(state => state.isGenerating);
  const generateQuiz = useQuizStore(state => state.generateQuiz);
  const toast = useToast();
  const modal = useModal();

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Generate the quiz using our store
    await generateQuiz();

    // show toast generate quiz success
    toast.success(t('quizGeneratedSuccess'));
    
    // Navigate to the quiz page with locale
    router.push(`/${locale}/quiz-create`);
  };

  const onClickHelp = () => {
    modal.open({
      title: 'Help',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            { t('help') ?? 'Create an effective quiz by including these key parameters in your prompt:' }
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium rounded-full px-2.5 py-0.5 text-xs mr-2 mt-0.5 whitespace-nowrap">{ t('number') ?? 'Number' }</span>
              <span className="text-gray-700 dark:text-gray-300">{ t('numberHelp') ?? 'Specify how many questions you want (maximum 25)' }</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-full px-2.5 py-0.5 text-xs mr-2 mt-0.5 whitespace-nowrap">{ t('topic') ?? 'Topic' }</span>
              <span className="text-gray-700 dark:text-gray-300">{ t('topicHelp') ?? 'Define the subject area for your quiz' }</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-medium rounded-full px-2.5 py-0.5 text-xs mr-2 mt-0.5 whitespace-nowrap">{ t('difficulty') ?? 'Difficulty' }</span>
              <span className="text-gray-700 dark:text-gray-300">{ t('difficultyHelp') ?? 'Set the challenge level (e.g., easy, medium, hard)' }</span>
            </li>
          </ul>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{ t('exampleTitle') ?? 'Example:' }</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              { t('exampleDescription') ?? 'Create 10 questions about renewable energy sources, medium difficulty.' }
            </p>
          </div>
        </div>
      ),
      size: 'md',
      closeOnClickOutside: true,
      showCloseButton: false,
    });
  }

  return (
    <form onSubmit={handleGenerateQuiz} className="w-full mx-auto">
      <div className="mb-4 relative">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 
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

        {/** help icon on the bottom right, background color is blue and icon is white */}
        <button 
          type="button" 
          className="absolute bottom-4 right-2 text-gray-500 hover:text-gray-700 bg-blue-600 rounded-full p-2 cursor-pointer"
          onClick={onClickHelp} 
        >
          <HelpCircle className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex justify-center sm:justify-end">
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 
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