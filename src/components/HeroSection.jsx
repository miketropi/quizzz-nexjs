"use client";

import { useTranslations } from 'next-intl';
import QuizGeneratorForm from './QuizGeneratorForm';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current && sectionRef.current) {
        const scrollPosition = window.scrollY;
        const sectionTop = sectionRef.current.offsetTop;
        const scrollOffset = scrollPosition - sectionTop;
        
        // Apply parallax effect (slower scrolling for video)
        if (scrollOffset > -window.innerHeight && scrollOffset < window.innerHeight) {
          videoRef.current.style.transform = `translateY(${scrollOffset * 0.3}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden py-20 text-white"
    >
      {/* Background video with parallax effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-h-full min-w-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/65 via-indigo-700/65 to-pink-600/65 backdrop-blur-sm" />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl"> 
          {t('title')}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
          {t('subtitle')}
        </p>
        
        <div className="mx-auto max-w-xl">
          <QuizGeneratorForm />
        </div>
      </div>
    </section>
  );
} 