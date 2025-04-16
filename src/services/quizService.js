import { FirestoreApi } from './api';

/**
 * Service for managing quizzes in Firestore
 */
class QuizService {
  constructor() {
    this.api = new FirestoreApi('quizzes');
  }

  /**
   * Get all quizzes with optional filtering
   * @param {Object} options - Query options
   * @param {string} [options.userId] - Filter by user ID
   * @param {string} [options.category] - Filter by category
   * @param {number} [options.limit] - Maximum number of quizzes to retrieve
   * @param {string} [options.orderBy] - Field to order by
   * @param {string} [options.orderDirection] - Order direction ('asc' or 'desc')
   * @returns {Promise<Array>} - Array of quiz documents
   */
  async getQuizzes(options = {}) {
    const { userId, category, limit, orderBy = 'createdAt', orderDirection = 'desc' } = options;
    
    const filters = [];
    
    if (userId) {
      filters.push({ field: 'userId', operator: '==', value: userId });
    }
    
    if (category) {
      filters.push({ field: 'category', operator: '==', value: category });
    }
    
    return this.api.query(filters, {
      orderByFields: [{ field: orderBy, direction: orderDirection }],
      limitCount: limit
    });
  }

  /**
   * Get a quiz by ID
   * @param {string} quizId - Quiz ID
   * @returns {Promise<Object|null>} - Quiz document or null if not found
   */
  async getQuizById(quizId) {
    return this.api.getById(quizId);
  }

  // get quiz by id and token
  async getQuizByIdAndToken(quizId, token) {
    return this.api.getByIdAndToken(quizId, token);
  }

  /**
   * Get quizzes created by a specific user
   * @param {string} userId - User ID
   * @param {number} [limit] - Maximum number of quizzes to retrieve
   * @returns {Promise<Array>} - Array of quiz documents
   */
  async getQuizzesByUser(userId, limit) {
    return this.getQuizzes({ userId, limit });
  }

  /**
   * Create a new quiz
   * @param {Object} quizData - Quiz data
   * @param {string} quizData.title - Quiz title
   * @param {string} quizData.userId - User ID
   * @param {string} [quizData.description] - Quiz description
   * @param {string} [quizData.category] - Quiz category
   * @param {Array} quizData.questions - Quiz questions
   * @returns {Promise<Object>} - Created quiz document
   */
  async createQuiz(quizData) {
    return this.api.create(quizData);
  }

  /**
   * Update an existing quiz
   * @param {string} quizId - Quiz ID
   * @param {Object} quizData - Updated quiz data
   * @returns {Promise<Object>} - Updated quiz document
   */
  async updateQuiz(quizId, quizData) {
    return this.api.update(quizId, quizData);
  }

  /**
   * Update the status of a quiz
   * @param {string} quizId - Quiz ID
   * @param {string} status - Status to update to
   * @returns {Promise<Object>} - Updated quiz document
   */
  async updateQuizStatus(quizId, status) {
    return this.api.update(quizId, { status });
  }

  /**
   * Delete a quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteQuiz(quizId) {
    return this.api.delete(quizId);
  }

  /**
   * Search quizzes by title or description
   * @param {string} searchTerm - Search term
   * @param {number} [limit] - Maximum number of results
   * @returns {Promise<Array>} - Array of matching quiz documents
   */
  async searchQuizzes(searchTerm, limit) {
    // Note: This is a simplified example. Real text search in Firestore
    // typically requires Cloud Functions or a service like Algolia.
    // This implementation will only find exact matches.
    const filters = [
      { field: 'title', operator: '==', value: searchTerm }
    ];
    
    return this.api.query(filters, { limitCount: limit });
  }
}

// Export a singleton instance
const quizService = new QuizService();
export default quizService; 