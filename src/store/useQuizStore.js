import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import quizService from '@/services/quizService'
import { useAuthStore } from '@/store'
/**
 * Quiz-specific store using Zustand with Immer
 * Manages quiz generation, questions, answers, and user interactions
 */
export const useQuizStore = create(
  persist(
    immer((set, get) => ({
      // Quiz creation state
      prompt: '',
      isGenerating: false,
      error: null,

      // Generated quiz state
      quiz: {
        title: '',
        description: '',
        questions: [],
        createdAt: null,
      },

      // History of generated quizzes
      quizHistory: [],

      // User answers and progress
      userAnswers: {},
      currentQuestion: 0,
      quizCompleted: false,
      
      // Actions for quiz creation
      setPrompt: (prompt) => set((state) => {
        state.prompt = prompt
      }),

      generateQuiz: async () => {
        const prompt = get().prompt
        
        if (!prompt.trim()) {
          set((state) => {
            state.error = 'Please provide a topic for your quiz'
          })
          return
        }
        
        set((state) => {
          state.isGenerating = true
          state.error = null
        })
        
        try {
          // Use the REST API endpoint instead of directly calling aiClient
          const response = await fetch('/api/v1/generate-quiz', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              prompt,
              model: 'deepseek-chat',
              options: {
                response_format: {
                  type: "json_object"
                }
              }
            }),
          })
          
          if (!response.ok) {
            throw new Error('Failed to generate quiz')
          }
          
          const Quiz = await response.json()
          
          set((state) => {
            state.quiz = {
              ...Quiz,
              status: 'public', // public, private, draft
              limitTime: null, // in seconds, null for no limit
            }
            state.quizHistory.push({
              id: Date.now(),
              title: Quiz.title,
              createdAt: Quiz.createdAt,
              questionCount: Quiz.questions.length
            })
            state.isGenerating = false
            state.userAnswers = {}
            state.currentQuestion = 0
            state.quizCompleted = false
          })
        } catch (error) {
          set((state) => {
            state.error = error.message || 'Failed to generate quiz'
            state.isGenerating = false
          })
        }
      },
      
      updateQuiz: (editedQuiz) => set((state) => {
        state.quiz = editedQuiz
      }),
      
      // Quiz management
      saveQuiz: async (editedQuiz) => {
        // If an edited quiz is provided, update the current quiz
        if (editedQuiz) {
          set((state) => {
            state.quiz = editedQuiz
          })
        }
        
        // This is now handled automatically by the persist middleware
        // console.log('Quiz state is automatically saved to localStorage')

        // save quiz to firestore
        const quizToSave = editedQuiz || get().quiz
        const { user } = useAuthStore.getState()
        const quiz = await quizService.createQuiz({...quizToSave, userId: user.uid})

        console.log('Quiz saved to firestore', quiz)
      },
      
      deleteQuizFromHistory: (quizId) => set((state) => {
        state.quizHistory = state.quizHistory.filter(q => q.id !== quizId)
      })
    })),
    {
      name: 'quiz-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only store these fields in localStorage
        prompt: state.prompt,
        quiz: state.quiz,
        quizHistory: state.quizHistory,
        userAnswers: state.userAnswers,
        currentQuestion: state.currentQuestion,
        quizCompleted: state.quizCompleted
      }),
    }
  )
) 