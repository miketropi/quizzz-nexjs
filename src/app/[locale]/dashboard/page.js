'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import QuizzesTab from '@/components/dashboard/QuizzesTab';
import ActivityTab from '@/components/dashboard/ActivityTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import Loader from '@/components/dashboard/Loader';
import quizService from '@/services/quizService';
import userService from '@/services/userService';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('quizzes');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          
          // Fetch user quizzes
          const quizzes = await quizService.getQuizzesByUser(user.uid);
          setUserQuizzes(quizzes);
          
          // Fetch user profile
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizService.deleteQuiz(quizId);
        setUserQuizzes(userQuizzes.filter(quiz => quiz.id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Dashboard Content */}
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Content Based on Active Tab */}
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Quizzes Tab */}
              {activeTab === 'quizzes' && (
                <QuizzesTab 
                  userQuizzes={userQuizzes}
                  handleDeleteQuiz={handleDeleteQuiz}
                />
              )}
              
              {/* Activity Tab */}
              {activeTab === 'activity' && <ActivityTab />}
              
              {/* Profile Tab */}
              {activeTab === 'profile' && <ProfileTab />}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && <SettingsTab />}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 