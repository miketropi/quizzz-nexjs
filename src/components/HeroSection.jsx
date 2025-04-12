"use client";

import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store';
import { useTranslations, useLocale } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');
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
    router.push(`/${locale}/quiz`);
  };

  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
          {t('subtitle')}
        </p>
        
        <div className="mx-auto max-w-xl">
          <form onSubmit={handleGenerateQuiz} className="flex flex-col space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full rounded-lg border border-transparent bg-white/10 px-4 py-3 text-white backdrop-blur-sm placeholder:text-white/70 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
                rows={4}
                style={{ resize: "vertical" }}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-center font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                t('cta')
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 