import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import { useLocale } from 'next-intl';
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

export const metadata = {
  title: "Quizzz - AI-Powered Quiz Generation",
  description: "Generate engaging quizzes using AI based on your topic or concept",
};

export default function RootLayout({ children }) {

  const locale = useLocale();
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  ); 
} 