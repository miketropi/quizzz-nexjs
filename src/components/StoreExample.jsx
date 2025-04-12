'use client'

import { useStore } from '@/store'

/**
 * Example component demonstrating Zustand store usage
 */
export function StoreExample() {
  const count = useStore(state => state.count)
  const { increment, decrement, reset } = useStore(state => ({
    increment: state.increment,
    decrement: state.decrement,
    reset: state.reset
  }))

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl mb-4">Zustand Store Example</h2>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-center mb-2">{count}</p>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={decrement}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <button 
            onClick={reset}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Reset
          </button>
          <button 
            onClick={increment}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>This component demonstrates using Zustand with Immer for state management.</p>
        <p>Open this component in multiple places to see how state is shared!</p>
      </div>
    </div>
  )
} 