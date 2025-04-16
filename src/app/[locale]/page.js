'use client';

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { useTranslations } from 'next-intl';
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useToast } from '@/components/Toast';

export default function Home() {
  const t = useTranslations();
  const toast = useToast();
  
  const testToastAnimations = () => {
    toast.success('Success toast with Framer Motion animation!');
    
    setTimeout(() => {
      toast.error('Error toast with Framer Motion animation!');
    }, 1000);
    
    setTimeout(() => {
      toast.warning('Warning toast with Framer Motion animation!');
    }, 2000);
    
    setTimeout(() => {
      toast.info('Info toast with Framer Motion animation!');
    }, 3000);
  };
  
  return (
    <>
      <HeroSection />
      {/* <div className="flex justify-center my-8">
        <button 
          onClick={testToastAnimations} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Test Toast Animations
        </button>
      </div> */}
      <FeaturesSection />
    </>
  );
} 