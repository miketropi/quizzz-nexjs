import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/**
 * Main application store using Zustand with Immer integration
 * for immutable state updates with a mutable API
 */
export const useStore = create(
  immer((set) => ({
    // Example state
  }))
) 