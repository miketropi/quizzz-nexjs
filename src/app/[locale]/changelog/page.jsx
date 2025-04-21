/**
 * Changelog data for the app 
 */
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Tag, Calendar, Info } from 'lucide-react';

export const changelog = [
  {
    version: '1.0.0',
    date: '2025-04-20',
    title: 'Initial release 🚀',
    description: `
      <div class="space-y-4">
        <p class="text-gray-700">First public release of <span class="font-semibold text-indigo-600">Quizzz Gen AI</span> - an interactive quiz generation application powered by artificial intelligence. 🎉</p>
        
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Key Features: ✨</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-700">
            <li>🧠 AI-powered quiz generation from simple prompts</li>
            <li>🌍 Support for multiple languages</li>
            <li>⚡ Real-time quiz results and feedback</li>
            <li>👥 Ability to share quizzes with friends</li>
            <li>🎮 Customizable quiz difficulty levels</li>
          </ul>
        </div>
        
        <p class="text-gray-700">Quizzz Gen AI helps teachers 👩‍🏫, content creators 🎨, and curious minds 🧠 create engaging educational content in seconds. ⏱️</p>
        
        <p class="text-gray-700 flex items-center"><span class="inline-block mr-2">🚀</span> Deployed to Fly.io for global accessibility and improved performance. 🌐</p>
      </div>
    `,
  },
  {
    version: '0.9.0',
    date: '2025-04-18',
    title: 'Beta Release 🧪',
    description: `
      <div class="space-y-4">
        <p class="text-gray-700">Public beta release with core features for testing. 🔍</p>
        
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Added: ➕</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-700">
            <li>🔐 User authentication system</li>
            <li>📊 Dashboard for managing quizzes</li>
            <li>✏️ Quiz creation flow</li>
            <li>📈 Basic result tracking</li>
          </ul>
        </div>
        
        <div class="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-md">
          <h3 class="text-lg font-medium text-amber-800 mb-2">Known Issues: ⚠️</h3>
          <ul class="list-disc pl-5 space-y-1 text-amber-700">
            <li>🗣️ Limited language support (English only)</li>
            <li>📱 Mobile responsiveness improvements needed</li>
            <li>⚙️ Performance optimizations pending</li>
          </ul>
        </div>
      </div>
    `,
  },
  {
    version: '0.8.0',
    date: '2025-04-15',
    title: 'Alpha Testing 🔬',
    description: `
      <div class="space-y-4">
        <p class="text-gray-700">Alpha testing phase with selected users. 👥</p>
        
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Implemented: 🛠️</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-700">
            <li>🤖 AI integration for quiz generation</li>
            <li>❓ Basic question formats</li>
            <li>📝 Quiz taking interface</li>
            <li>📊 Simple analytics</li>
          </ul>
        </div>
        
        <p class="text-gray-700 italic">This version is being tested with a small group of educators 👩‍🏫 and students 👨‍🎓.</p>
      </div>
    `,
  },
  {
    version: '0.5.0',
    date: '2025-04-01',
    title: 'Internal Prototype 🧩',
    description: `
      <div class="space-y-4">
        <p class="text-gray-700">First internal prototype of Quizzz Gen AI. Not publicly available. 🔒</p>
        
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Features: 💡</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-700">
            <li>🧪 Proof of concept for AI-driven question generation</li>
            <li>🎨 Basic UI components</li>
            <li>💬 Experimental prompt engineering</li>
          </ul>
        </div>
        
        <p class="text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-gray-200">This version laid the foundation 🏗️ for our approach to educational content generation using AI. 🚀</p>
      </div>
    `,
  },
];

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

export default function ChangelogPage() {
  const t = useTranslations('Changelog');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">{t('title', 'Changelog')}</h1>
          <p className="text-lg text-gray-600">
            {t('subtitle', 'Track our progress and see what\'s new in Quizzz Gen AI')}
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {changelog.map((release, index) => (
            <motion.div 
              key={`${release.version}-${index}`}
              variants={fadeInUp}
              className="bg-white rounded-xl p-8 relative overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Version badge */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-xl flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span className="font-mono">{release.version}</span>
              </div>
              
              {/* Release info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{release.title}</h2>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{release.date}</span>
                </div>
              </div>
              
              {/* Description - render HTML content */}
              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: release.description }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-16 bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-start"
        >
          <Info className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">{t('stayUpdated', 'Stay Updated')}</h3>
            <p className="text-blue-700">
              {t('updateInfo', 'We regularly update Quizzz Gen AI with new features, improvements, and bug fixes. Check back here to see what\'s new!')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
