'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/Toast';

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

export default function ContactPage() {
  const t = useTranslations();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real application, you would send the form data to your backend:
    try {

      const mailData = {
        from: formData.email,
        subject: 'New message from contact form',
        text: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
        html: `<p>Name: ${formData.name}</p><p>Email: ${formData.email}</p><p>Subject: ${formData.subject}</p><p>Message: ${formData.message}</p>`,
      };

      const response = await fetch('/api/v1/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mailData),
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Your message has been sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: t('contact.email', 'Email'),
      details: 'support@quizzz.com',
      link: 'mailto:support@quizzz.com'
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      title: t('contact.phone', 'Phone'),
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      title: t('contact.address', 'Address'),
      details: '123 Education St, Learning City, 10001',
      link: 'https://maps.google.com/?q=123+Education+St'
    }
  ];
  
  const faqItems = [
    {
      id: 1,
      question: 'How do I create a quiz using Quizzz Gen AI?',
      answer: '✨ Creating a quiz is simple! Just navigate to the homepage, enter your desired topic in the input field, select the number of questions and difficulty level, then click "Create Quiz". 🚀 Our AI will generate a complete quiz for you in seconds. Magic, right? 🪄'
    },
    {
      id: 2,
      question: 'Can I edit quizzes after they are generated?',
      answer: '💯 Yes! After generating a quiz, you can enable Edit Mode to customize titles, descriptions, questions, answer options, and explanations. 🛠️ Simply click "Edit Quiz" on your quiz page to make changes, then save when you\'re done. Your quiz, your rules! 👑'
    },
    {
      id: 3,
      question: 'How do I share my quizzes with friends?',
      answer: '🎮 You can share quizzes by making them public in your dashboard. Navigate to "My Quizzes", select the quiz you want to share, and click "Make Public". 🎯 You\'ll then receive a shareable link that you can send to friends or post on social media. Let the competition begin! 🏆'
    },
    {
      id: 4,
      question: 'Are my quiz results saved for later review?',
      answer: '💾 Absolutely! All your quiz submissions are saved in your account. You can access them anytime by going to your Dashboard and clicking on the "Submissions" tab to review your performance, scores, and correct answers. 📈 Track your progress and watch yourself improve! 🌟'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-pattern rotate-3 scale-110" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('contact.title', 'Contact Us')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            {t('contact.subtitle', 'We\'d love to hear from you. Get in touch with our team.')}
          </p>
        </div>
      </section>

      {/* Contact form section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact information */}
              <div className="md:col-span-1">
                <motion.h2 
                  className="text-2xl font-bold mb-6 text-gray-800"
                  variants={fadeInUp}
                >
                  {t('contact.info', 'Contact Information')}
                </motion.h2>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start"
                      variants={fadeInUp}
                    >
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <a 
                          href={item.link} 
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {item.details}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-8 pt-8 border-t border-gray-200"
                  variants={fadeInUp}
                >
                  <h3 className="font-medium text-gray-900 mb-4">{t('contact.followUs', 'Follow Us')}</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-500 hover:text-blue-600">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>
              
              {/* Contact form */}
              <motion.div 
                className="md:col-span-2 bg-white rounded-lg shadow-sm p-8 border border-gray-100"
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('contact.getInTouch', 'Get in Touch')}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        {t('contact.form.name', 'Name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block p-3 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('contact.form.email', 'Email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block p-3 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.subject', 'Subject')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1 block p-3 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.message', 'Message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 block p-3 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border-1"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="mr-2 h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>{t('contact.form.sending', 'Sending...')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="mr-2 h-5 w-5" />
                          <span>{t('contact.form.send', 'Send Message')}</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('contact.faq.title', 'Frequently Asked Questions')}</h2>
            <p className="text-gray-600">
              {t('contact.faq.subtitle', 'Find answers to common questions about our services and platform.')}
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((faq) => (
                <motion.div 
                  key={faq.id} 
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
                    <MessageSquare className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
