import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeToAuthChanges, logout, subscribeToIdTokenChanges } from '../services/auth'
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

      
      // subscribe to id token changes
      const unsubscribeIdToken = subscribeToIdTokenChanges(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          nookies.set(undefined, 'token', token, { path: '/' });
        } else {
          nookies.destroy(undefined, 'token');
        }
      })
      

      return { unsubscribe, unsubscribeIdToken };
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
let __unsubscribe;
let __unsubscribeIdToken;
// Only run in browser environment
if (typeof window !== 'undefined') {
  const { unsubscribe, unsubscribeIdToken } = await useAuthStore.getState().initAuth();
  __unsubscribe = unsubscribe;
  __unsubscribeIdToken = unsubscribeIdToken;
}

// Handle cleanup for hot module replacement in development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.dispose(() => {
    if (__unsubscribe) __unsubscribe();
    if (__unsubscribeIdToken) __unsubscribeIdToken();
  });
} 