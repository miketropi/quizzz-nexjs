import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeToAuthChanges, logout } from '../services/auth'
import nookies from 'nookies';

/**
 * Auth-specific store using Zustand with Immer
 * Manages authentication state and user information
 */
export const useAuthStore = create(
  immer((set) => ({
    // Auth state
    user: null,
    loading: true,

    // Actions
    initAuth: async () => {
      const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
        // console.log('________________User is logged in:', token); 

        if (currentUser) {
          const token = await currentUser.getIdToken();
          nookies.set(undefined, 'token', token, { path: '/' });

          // get redirectUrlAfterLogin from local storage
          const redirectUrlAfterLogin = localStorage.getItem('redirectUrlAfterLogin');
          if (redirectUrlAfterLogin) {
            localStorage.removeItem('redirectUrlAfterLogin');
            // window.location.href = redirectUrlAfterLogin;
            window.location.href = redirectUrlAfterLogin;
          }
        } else {
          nookies.destroy(undefined, 'token');
        }

        set((state) => { 
          state.user = currentUser;
          state.loading = false;
        });
      });

      return unsubscribe;
    },

    // Computed getters
    isAuthenticated: (state) => !!state.user,

    // logout
    logout: () => {
      logout();
      
      // redirect to home
      window.location.href = '/';
    },
    
  }))
);

// Initialize auth listener when this module is imported
let unsubscribeAuth;

// Only run in browser environment
if (typeof window !== 'undefined') {
  unsubscribeAuth = useAuthStore.getState().initAuth();
}

// Handle cleanup for hot module replacement in development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.dispose(() => {
    if (unsubscribeAuth) unsubscribeAuth();
  });
} 