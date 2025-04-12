import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Make sure to return the locale
  return {
    locale: locale || 'en',
    messages: (await import(`./messages/${locale || 'en'}/index.json`)).default
  };
}); 