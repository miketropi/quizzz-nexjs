'use client';

import { useAuth } from '../../../components/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { logout } from '../../../services/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-md text-gray-900">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="mt-1 text-md text-gray-900">{user?.uid}</p>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 