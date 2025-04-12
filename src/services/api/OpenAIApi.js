import BaseApi from './BaseApi';

/**
 * OpenAI API client
 * Uses the OpenAI API key from environment variables
 */
export default class OpenAIApi extends BaseApi {
  constructor() {
    super('https://api.openai.com/v1', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''}`
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
      model: params.model || 'gpt-3.5-turbo',
      messages: params.messages || [],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens,
      ...params
    });
  }

  /**
   * Generate an image using DALL-E
   * @param {Object} params - The request parameters
   * @returns {Promise<Object>} - The image generation response
   */
  async generateImage(params) {
    return this.post('/images/generations', {
      prompt: params.prompt,
      n: params.n || 1,
      size: params.size || '1024x1024',
      ...params
    });
  }
} 