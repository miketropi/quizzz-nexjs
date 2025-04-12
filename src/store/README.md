# State Management with Zustand and Immer

This project uses [Zustand](https://github.com/pmndrs/zustand) with [Immer](https://github.com/immerjs/immer) for state management.

## Project-Specific Stores

### Quiz Store

The main store for the quiz application is `useQuizStore`. This store handles:

- Quiz generation from user prompts
- Managing quiz questions and answers
- User progress through the quiz
- Scoring and results

```jsx
import { useQuizStore } from '@/store'

// Generate a quiz
const { prompt, setPrompt, generateQuiz } = useQuizStore()

// Take a quiz
const { 
  quiz, 
  userAnswers, 
  answerQuestion, 
  goToNextQuestion,
  getScore 
} = useQuizStore()
```

## Basic Usage

Import the store hook in your component:

```jsx
import { useStore } from '@/store'

function Counter() {
  const count = useStore(state => state.count)
  const increment = useStore(state => state.increment)
  const decrement = useStore(state => state.decrement)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

## Accessing Multiple State Values

You can access multiple state values with a single subscription:

```jsx
import { useStore } from '@/store'

function UserInfo() {
  const { isLoggedIn, data } = useStore(state => state.user)
  const logout = useStore(state => state.logout)
  
  if (!isLoggedIn) return <p>Not logged in</p>
  
  return (
    <div>
      <p>Welcome, {data.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Creating Domain-Specific Stores

For larger applications, consider creating domain-specific stores:

1. Create a new file in the `store` directory (e.g., `useQuizStore.js`)
2. Define your store using the Zustand+Immer pattern
3. Export the custom hook
4. Add the export to `src/store/index.js`

Example:

```jsx
// store/useQuizStore.js
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useQuizStore = create(
  immer((set) => ({
    // State properties
    quiz: { questions: [] },
    
    // Actions
    generateQuiz: () => set((state) => {
      // Implementation
    }),
    
    // ...other actions
  }))
)
```

## Benefits of Immer

Immer allows you to write "mutative" code while maintaining immutability behind the scenes:

- More intuitive API for updates
- Simplified nested object updates
- Better performance for deep updates

Without Immer, updates would look like:

```js
// Without Immer
increment: () => set(state => ({ count: state.count + 1 }))

// With nested objects (without Immer)
updateUserName: (name) => set(state => ({
  user: {
    ...state.user,
    data: {
      ...state.user.data,
      name
    }
  }
}))
```

With Immer, we can simplify to:

```js
// With Immer
increment: () => set(state => { state.count += 1 })

// With nested objects (with Immer)
updateUserName: (name) => set(state => {
  state.user.data.name = name
})
``` 