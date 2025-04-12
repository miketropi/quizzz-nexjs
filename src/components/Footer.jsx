import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold">{t('app.title')}</h2>
            <p className="text-sm text-gray-600">{t('app.description')}</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{t('footer.terms')}</a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{t('footer.privacy')}</a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{t('footer.contact')}</a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} {t('app.title')}. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 