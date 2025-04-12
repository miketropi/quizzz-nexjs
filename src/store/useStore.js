import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/**
 * Main application store using Zustand with Immer integration
 * for immutable state updates with a mutable API
 */
export const useStore = create(
  immer((set) => ({
    // Example state
    count: 0,
    
    // Example actions
    increment: () => set((state) => {
      state.count += 1
    }),
    decrement: () => set((state) => {
      state.count -= 1
    }),
    reset: () => set((state) => {
      state.count = 0
    }),
    
    // More complex example with nested state
    user: {
      isLoggedIn: false,
      data: null,
    },
    
    // Login action example
    login: (userData) => set((state) => {
      state.user.isLoggedIn = true
      state.user.data = userData
    }),
    
    // Logout action example
    logout: () => set((state) => {
      state.user.isLoggedIn = false
      state.user.data = null
    }),
  }))
) 