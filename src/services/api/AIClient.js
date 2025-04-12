/**
 * AIClient - A unified client for working with multiple AI providers
 * 
 * This class provides a consistent interface to work with
 * different AI providers (OpenAI and Deepseek) with the ability
 * to easily switch between them.
 */
export default class AIClient {
  constructor(provider = 'openai', apiInstances = {}) {
    this.apiInstances = apiInstances;
    this.setProvider(provider);
  }

  /**
   * Set the AI provider to use
   * @param {string} provider - The provider name ('openai' or 'deepseek')
   */
  setProvider(provider) {
    if (provider === 'openai') {
      this.api = this.apiInstances.openaiApi;
      this.provider = 'openai';
    } else if (provider === 'deepseek') {
      this.api = this.apiInstances.deepseekApi;
      this.provider = 'deepseek';
    } else {
      throw new Error(`Unsupported AI provider: ${provider}. Use 'openai' or 'deepseek'.`);
    }
  }

  /**
   * Generate a text response using the configured AI provider
   * @param {string} prompt - The user prompt
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - The generated text response
   */
  async generateText(prompt, options = {}) {
    const messages = options.messages || [
      { role: 'system', content: options.systemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ];
    
    try {
      const response = await this.api.createChatCompletion({
        messages,
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        ...options.additionalParams
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error(`Error generating text with ${this.provider}:`, error);
      throw error;
    }
  }

  /**
   * Generate an image using OpenAI DALL-E (only available with OpenAI provider)
   * @param {string} prompt - The image description
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - The image URL
   */
  async generateImage(prompt, options = {}) {
    if (this.provider !== 'openai') {
      throw new Error('Image generation is currently only supported with the OpenAI provider');
    }
    
    try {
      const response = await this.api.generateImage({
        prompt,
        n: options.count || 1,
        size: options.size || '1024x1024',
        ...options.additionalParams
      });
      
      return response.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for text inputs
   * @param {string|string[]} inputs - Text to generate embeddings for
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - The embeddings response
   */
  async generateEmbeddings(inputs, options = {}) {
    // Normalize input to array if single string is provided
    const normalizedInputs = Array.isArray(inputs) ? inputs : [inputs];
    
    if (this.provider === 'deepseek') {
      try {
        return await this.api.createEmbeddings({
          input: normalizedInputs,
          model: options.model || 'deepseek-embeddings',
          ...options.additionalParams
        });
      } catch (error) {
        console.error('Error generating embeddings with Deepseek:', error);
        throw error;
      }
    } else {
      // For OpenAI, use appropriate embedding endpoint
      try {
        const response = await this.api.post('/embeddings', {
          input: normalizedInputs,
          model: options.model || 'text-embedding-ada-002',
          ...options.additionalParams
        });
        
        return response;
      } catch (error) {
        console.error('Error generating embeddings with OpenAI:', error);
        throw error;
      }
    }
  }

  async analyzePrompt(prompt, options = {}) {
    const systemPrompt = `
    You are an expert in analyzing text and providing a summary of the main points.
    `;
    const __prompt = `
    Analyze the following text and provide a summary of the main points.
    - **Text**: ${prompt}
    - **Response Format**: Format the summary as a JSON object with the following structure:
    {
      "topic": "Quiz topic of the text",
      "language": "Vietnamese", // Language of the text
      "questionCount": 5, // Number of questions in the quiz
      "difficulty": "Easy", // Difficulty of the quiz
    }
    `
    try {
      const summary = await this.generateText(__prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2000,
        ...options
      }).then(text => {
        try {
          // Find JSON part of the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw new Error('No valid JSON found in response');
        } catch (error) {
          console.error('Failed to parse AI response:', error);
          throw new Error('Failed to generate quiz: Invalid response format');
        }
      });

      return summary;
      
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }

  /**
   * Generate a quiz based on a prompt
   * @param {string} prompt - The quiz topic or prompt
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - The generated quiz
   */
  async generateQuiz(prompt, options = {}) {

    const summary = await this.analyzePrompt(prompt, options);
    console.log('summary', summary);
    const { topic, language, questionCount, difficulty } = summary;

    const systemPrompt = `You are an expert quiz creator with deep knowledge across many subjects.
Your task is to create engaging, educational multiple-choice quizzes that test knowledge accurately.
Follow these guidelines:
- Create clear, unambiguous questions with one definitively correct answer
- Ensure all answer options are plausible but only one is correct
- Match the difficulty level to the likely audience for this topic
- Provide brief, informative explanations for the correct answers
- Format your response exactly as specified in the JSON structure
- Detect the language of the prompt and create the quiz in that same language`
    
    const __prompt = `
    Create a quiz of multiple-choice questions on the topic of "${topic}".
    - **Number of Questions**: ${ questionCount >= 10 ? 10 : questionCount }.
    - **Language Detection**: ${ language }.
    - **Difficulty Level**: ${ difficulty }.
    - **Response Format**: Format the quiz as a JSON object with the following structure:
    {
      "title": "Quiz title here",
      "description": "Brief description of the quiz",
      "questions": [
        {
          "id": "0e66df44", // Unique random ID for the question
          "question": "Question text",
          "options": { "A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D" },
          "correctAnswer": "A", // Key of the correct answer in the options object
          "explanation": "Explanation of the correct answer"
        }
      ]
    }`
    
    try {
      const quizContent = await this.generateText(__prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2000,
        ...options
      }).then(text => {
        try {
          // Find JSON part of the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw new Error('No valid JSON found in response');
        } catch (error) {
          console.error('Failed to parse AI response:', error);
          throw new Error('Failed to generate quiz: Invalid response format');
        }
      });

      // console.log('quizContent', quizContent);
      const { title, description, questions } = quizContent;
      
      // Process the raw text into a structured quiz object
      // For now, just return a mock structure with the generated content
      // In production, this would properly parse the AI output
      return {
        title,
        description,
        questions,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }
} 