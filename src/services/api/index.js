import BaseApi from './BaseApi';
import OpenAIApi from './OpenAIApi';
import DeepseekApi from './DeepseekApi';
import AIClient from './AIClient';
import QuizApi from './QuizApi';
import FirestoreApi from './FirestoreApi';

// Export classes
export {
  BaseApi,
  OpenAIApi,
  DeepseekApi,
  AIClient,
  QuizApi,
  FirestoreApi
};

// Create and export default instances
export const openaiApi = new OpenAIApi();
export const deepseekApi = new DeepseekApi();
export const quizApi = new QuizApi();

// Create a unified AI client with default provider and pass API instances
export const aiClient = new AIClient(
  process.env.NEXT_PUBLIC_DEEPSPEED_API_KEY ? 'deepseek' : 'openai',
  { openaiApi, deepseekApi }
);

// You can add more API instances here
// export const someOtherApi = new SomeOtherApi();

/**
 * Create a new API instance with custom configuration
 * @param {string} baseURL - The base URL for the API
 * @param {Object} options - Configuration options
 * @returns {BaseApi} - A new BaseApi instance
 */
export const createApi = (baseURL, options = {}) => {
  return new BaseApi(baseURL, options);
}; 