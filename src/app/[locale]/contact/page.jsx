'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, MessageSquare, Facebook, Twitter, GitHub, LinkedIn } from 'lucide-react';
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
      details: 'devfunwatcher@gmail.com',
      link: 'mailto:devfunwatcher@gmail.com'
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      title: t('contact.phone', 'Phone'),
      details: '+84 xxxxxxxxxx',
      link: 'tel:+84 xxxxxxxxxx'
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      title: t('contact.address', 'Address'),
      details: '170 xxxx xxxx, Đà Nẵng City, 550000', 
      link: '#'
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
                    {/** facebook */}
                    <a href="https://www.facebook.com/people/Devfun/100068020483283/" target="_blank" className="text-gray-500 hover:text-blue-600">
                      <span className="sr-only">Facebook</span>
                      <Facebook className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" />
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
