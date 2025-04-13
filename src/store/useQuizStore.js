import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { aiClient } from '@/services/api'

/**
 * Quiz-specific store using Zustand with Immer
 * Manages quiz generation, questions, answers, and user interactions
 */
export const useQuizStore = create(
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
          state.quiz = Quiz
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
    
    // Quiz interaction actions
    answerQuestion: (questionId, answerIndex) => set((state) => {
      state.userAnswers[questionId] = answerIndex
    }),
    
    goToNextQuestion: () => set((state) => {
      if (state.currentQuestion < state.quiz.questions.length - 1) {
        state.currentQuestion += 1
      } else {
        state.quizCompleted = true
      }
    }),
    
    goToPreviousQuestion: () => set((state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1
      }
    }),
    
    resetQuiz: () => set((state) => {
      state.userAnswers = {}
      state.currentQuestion = 0
      state.quizCompleted = false
    }),
    
    // Computed values (getters)
    getScore: (state) => {
      if (!state.quiz.questions.length) return 0
      
      let correctCount = 0
      state.quiz.questions.forEach(question => {
        if (state.userAnswers[question.id] === question.correctAnswer) {
          correctCount++
        }
      })
      
      return {
        correct: correctCount,
        total: state.quiz.questions.length,
        percentage: Math.round((correctCount / state.quiz.questions.length) * 100)
      }
    },
    
    // Quiz management
    saveQuiz: () => {
      const { quiz } = get()
      // TODO: Implement saving to localStorage or backend
      console.log('Saving quiz:', quiz)
    },
    
    deleteQuizFromHistory: (quizId) => set((state) => {
      state.quizHistory = state.quizHistory.filter(q => q.id !== quizId)
    })
  }))
) 