'use client';

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { useTranslations } from 'next-intl';
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Home() {
  const t = useTranslations();
  
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
} 