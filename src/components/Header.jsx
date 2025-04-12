import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations();
  
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{t('app.title')}</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-sm hover:text-blue-600">{t('nav.home')}</a></li>
            <li><a href="#" className="text-sm hover:text-blue-600">{t('nav.about')}</a></li>
            <li><a href="#" className="text-sm hover:text-blue-600">{t('nav.quizzes')}</a></li>
            <li><a href="#" className="text-sm hover:text-blue-600">{t('nav.profile')}</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 