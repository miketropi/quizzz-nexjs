import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Define supported locales
const locales = ['en', 'fr', 'es', 'vi'];

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const metadata = {
  title: "Quizzz - AI-Powered Quiz Generation",
  description: "Generate engaging quizzes using AI based on your topic or concept",
};

export default async function LocaleLayout({ children, params }) {
  // console.log('------------------', params?.locale);
  // Get locale from params
  // const locale = await params?.locale;
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages
  let messages;
  try {
    messages = (await import(`../../messages/${locale}/index.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="flex min-h-screen flex-col">
            <LocaleSwitcher />
            <Header />
            {/* Main Content */}
            {children}
            <Footer />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 