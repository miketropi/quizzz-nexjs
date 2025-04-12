import BaseApi from './BaseApi';

/**
 * Deepseek API client
 * Uses the Deepseek API key from environment variables
 */
export default class DeepseekApi extends BaseApi {
  constructor() {
    super('https://api.deepseek.com/v1', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSPEED_API_KEY || ''}`
      }
    });
  }

  /**
   * Create a chat completion
   * @param {Object} params - The request parameters
   * @returns {Promise<Object>} - The completion response
   */
  async createChatCompletion(params) {
    return this.post('/chat/completions', {
      model: params.model || 'deepseek-chat',
      messages: params.messages || [],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens,
      ...params
    });
  }

  /**
   * Generate embeddings
   * @param {Object} params - The request parameters
   * @returns {Promise<Object>} - The embeddings response
   */
  async createEmbeddings(params) {
    return this.post('/embeddings', {
      model: params.model || 'deepseek-embeddings',
      input: params.input || [],
      ...params
    });
  }
} 