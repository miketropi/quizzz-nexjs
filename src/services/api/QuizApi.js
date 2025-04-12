import BaseApi from './BaseApi';

/**
 * Quiz API client
 * Handles quiz generation, retrieval, and management
 */
export default class QuizApi extends BaseApi {
  constructor() {
    super('/api/quiz', {
      headers: {
        // Add any specific headers needed for quiz API
      }
    });
  }

  /**
   * Generate a new quiz based on a prompt
   * @param {Object} params - The generation parameters
   * @param {string} params.prompt - The quiz topic or prompt
   * @param {number} params.questionCount - Number of questions to generate (default: 5)
   * @param {string} params.difficulty - Quiz difficulty level (easy, medium, hard)
   * @param {string} params.format - Quiz format (multiple-choice, true-false, etc)
   * @returns {Promise<Object>} - The generated quiz
   */
  async generateQuiz(params) {
    return this.post('/generate', {
      prompt: params.prompt,
      questionCount: params.questionCount || 5,
      difficulty: params.difficulty || 'medium',
      format: params.format || 'multiple-choice',
      ...params
    });
  }

  /**
   * Get all quizzes for the current user
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Number of items per page
   * @returns {Promise<Object>} - Paginated list of quizzes
   */
  async getQuizzes(params = {}) {
    return this.get('/', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...params
      }
    });
  }

  /**
   * Get a specific quiz by ID
   * @param {string} quizId - The quiz ID
   * @returns {Promise<Object>} - The quiz data
   */
  async getQuiz(quizId) {
    return this.get(`/${quizId}`);
  }

  /**
   * Save a quiz
   * @param {Object} quizData - The quiz data to save
   * @returns {Promise<Object>} - The saved quiz
   */
  async saveQuiz(quizData) {
    return this.post('/', quizData);
  }

  /**
   * Update an existing quiz
   * @param {string} quizId - The quiz ID
   * @param {Object} quizData - The updated quiz data
   * @returns {Promise<Object>} - The updated quiz
   */
  async updateQuiz(quizId, quizData) {
    return this.put(`/${quizId}`, quizData);
  }

  /**
   * Delete a quiz
   * @param {string} quizId - The quiz ID to delete
   * @returns {Promise<Object>} - The deletion response
   */
  async deleteQuiz(quizId) {
    return this.delete(`/${quizId}`);
  }

  /**
   * Submit answers for a quiz
   * @param {string} quizId - The quiz ID
   * @param {Object} answers - The user's answers
   * @returns {Promise<Object>} - The quiz results
   */
  async submitQuizAnswers(quizId, answers) {
    return this.post(`/${quizId}/submit`, { answers });
  }
}