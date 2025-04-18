import { FirestoreApi } from './api';

/**
 * Service for managing quiz submissions in Firestore
 */
class SubmittedService {
  constructor() {
    this.api = new FirestoreApi('submissions');
  }

  /**
   * Get all submissions with optional filtering
   * @param {Object} options - Query options
   * @param {string} [options.userId] - Filter by user ID
   * @param {string} [options.quizId] - Filter by quiz ID
   * @param {number} [options.limit] - Maximum number of submissions to retrieve
   * @param {string} [options.orderBy] - Field to order by
   * @param {string} [options.orderDirection] - Order direction ('asc' or 'desc')
   * @returns {Promise<Array>} - Array of submission documents
   */
  async getSubmissions(options = {}) {
    const { userId, quizId, limit, orderBy = 'submittedAt', orderDirection = 'desc' } = options;
    
    const filters = [];
    
    if (userId) {
      filters.push({ field: 'userId', operator: '==', value: userId });
    }
    
    if (quizId) {
      filters.push({ field: 'quizId', operator: '==', value: quizId });
    }
    
    return this.api.query(filters, {
      orderByFields: [{ field: orderBy, direction: orderDirection }],
      limitCount: limit
    });
  }

  /**
   * Get a submission by ID
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object|null>} - Submission document or null if not found
   */
  async getSubmissionById(submissionId) {
    return this.api.getById(submissionId);
  }

  /**
   * Get submissions by user ID
   * @param {string} userId - User ID
   * @param {number} [limit] - Maximum number of submissions to retrieve
   * @returns {Promise<Array>} - Array of submission documents
   */
  async getSubmissionsByUser(userId, limit) {
    return this.getSubmissions({ userId, limit });
  }

  /**
   * Get submissions by quiz ID
   * @param {string} quizId - Quiz ID
   * @param {number} [limit] - Maximum number of submissions to retrieve
   * @returns {Promise<Array>} - Array of submission documents
   */
  async getSubmissionsByQuiz(quizId, limit) {
    return this.getSubmissions({ quizId, limit });
  }

  /**
   * Create a new submission
   * @param {Object} submissionData - Submission data
   * @param {string} submissionData.userId - User ID
   * @param {string} submissionData.quizId - Quiz ID
   * @param {Array} submissionData.answers - User's answers
   * @param {number} submissionData.score - User's score
   * @returns {Promise<Object>} - Created submission document
   */
  async createSubmission(submissionData) {
    const submission = {
      ...submissionData,
      submittedAt: new Date().toISOString()
    };
    return this.api.create(submission);
  }

  /**
   * Update an existing submission
   * @param {string} submissionId - Submission ID
   * @param {Object} submissionData - Updated submission data
   * @returns {Promise<Object>} - Updated submission document
   */
  async updateSubmission(submissionId, submissionData) {
    return this.api.update(submissionId, submissionData);
  }

  /**
   * Delete a submission
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteSubmission(submissionId) {
    return this.api.delete(submissionId);
  }

  /**
   * Get submission statistics for a quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise<Object>} - Statistics object with count, averageScore, etc.
   */
  async getQuizStatistics(quizId) {
    const submissions = await this.getSubmissionsByQuiz(quizId);
    
    if (!submissions.length) {
      return {
        count: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      };
    }
    
    const scores = submissions.map(sub => sub.score || 0);
    const total = scores.reduce((sum, score) => sum + score, 0);
    
    return {
      count: submissions.length,
      averageScore: total / submissions.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores)
    };
  }
}

// Export a singleton instance
const submittedService = new SubmittedService();
export default submittedService;
