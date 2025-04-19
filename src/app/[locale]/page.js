'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { useModal } from '@/components/Modal';
import { Activity, Users, Brain, Zap, Star, ArrowRight } from 'lucide-react';

// Components
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const t = useTranslations();
  const toast = useToast();
  const modal = useModal();
  
  // Stats data (these would typically come from an API or database)
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '50,000+', label: 'Active Users' },
    { icon: <Activity className="h-6 w-6" />, value: '1M+', label: 'Quizzes Taken' },
    { icon: <Brain className="h-6 w-6" />, value: '250,000+', label: 'Questions Created' },
    { icon: <Zap className="h-6 w-6" />, value: '99.9%', label: 'Accuracy Rate' },
  ];
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "OMG! 🤩 This app has completely transformed my teaching workflow! 🚀 I used to spend HOURS creating quizzes, but now I can generate an entire test in minutes while sipping my morning coffee! ☕ My students think I've hired a secret assistant! 👩‍🏫✨",
      name: "Sarah Johnson",
      role: "High School Teacher | Science Department 🧪",
      rating: 5
    },
    {
      id: 2,
      quote: "As someone who's tested EVERY quiz tool on the market 🕵️‍♂️, I can confidently say this is the Ferrari of quiz generators! 🏎️ The AI understands context so well it's almost scary - it creates questions I would have written myself! Perfect for my YouTube educational content! 📱💯",
      name: "David Chen",
      role: "Content Creator | 500K+ Subscribers 🎬",
      rating: 5
    },
    {
      id: 3,
      quote: "My study group was struggling with boring flashcards until we found this gem! 💎 Now our study sessions are actually FUN (yes, really)! 🎮 The diverse question formats keep our brains engaged, and we've all seen our grades improve! 📈 Group study will never be the same! 🧠🔥",
      name: "Mia Rodriguez",
      role: "University Student | Psychology Major 🧠",
      rating: 4
    }
  ];
  
  const showFeaturePreview = () => {
    modal.open({
      title: "AI-Powered Quiz Generation",
      content: (
        <div className="space-y-4">
          <p>Our advanced AI algorithm creates tailored quizzes based on your specific requirements.</p>
          <p>Simply enter a topic, and let our technology do the rest!</p>
          <div className="mt-4">
            <button 
              onClick={() => {
                modal.close();
                toast.success('Ready to try it yourself!');
              }}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Now
            </button>
          </div>
        </div>
      )
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <HeroSection />
      
      
      {/* Features section */}
      <FeaturesSection />
      
      {/* Testimonials section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-white to-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            What Our Users Say
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <motion.div 
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&quot;{item.quote}&quot;</p>
                <div className="mt-auto">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Call-to-action section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            variants={fadeInUp}
          >
            Ready to Create Your First Quiz?
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto mb-8 opacity-90"
            variants={fadeInUp}
          >
            Join thousands of educators, students, and curious minds using our platform to create engaging quizzes in seconds.
          </motion.p>
          <motion.div
            variants={fadeInUp}
          >
            <button 
              onClick={showFeaturePreview}
              className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              See How It Works
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
} 