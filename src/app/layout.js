import { Geist, Geist_Mono, Space_Mono, Sono } from "next/font/google";
import { useLocale } from 'next-intl';
import { ToastProvider } from '@/components/Toast';
import { ConfirmProvider } from '@/components/Confirm';
import "./globals.css";

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

const sono = Sono({
  variable: "--font-sono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Quizzz - AI-Powered Quiz Generation",
  description: "Generate engaging quizzes using AI based on your topic or concept",
};

export default function RootLayout({ children }) {

  const locale = useLocale();
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${sono.variable} antialiased`}>
        <ConfirmProvider>
          <ToastProvider position="top-right">
            {children}
          </ToastProvider> 
        </ConfirmProvider>
      </body>
    </html>
  ); 
} 