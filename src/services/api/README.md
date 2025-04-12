# API Service

This directory contains a base API class and specific API implementations for making HTTP requests in the application.

## Files

- `BaseApi.js` - Foundation class for making API requests with error handling and authentication
- `OpenAIApi.js` - Implementation for OpenAI API requests
- `DeepseekApi.js` - Implementation for Deepseek API requests
- `AIClient.js` - Unified client that works with both OpenAI and Deepseek
- `index.js` - Exports API classes and initialized instances

## Usage Examples

### Using the Unified AI Client (Recommended)

```jsx
import { aiClient } from '@/services/api';

// Generate text with the default provider
async function generateResponse(prompt) {
  try {
    const response = await aiClient.generateText(prompt, {
      systemPrompt: 'You are a helpful assistant.'
    });
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return null;
  }
}

// Switch providers on demand
function switchToDeepseek() {
  aiClient.setProvider('deepseek');
}

function switchToOpenAI() {
  aiClient.setProvider('openai');
}

// Generate image (OpenAI only)
async function generateImage(prompt) {
  try {
    // Automatically switches to OpenAI if needed
    const imageUrl = await aiClient.generateImage(prompt, {
      size: '512x512'
    });
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Generate embeddings (works with either provider)
async function getEmbeddings(texts) {
  try {
    const embeddings = await aiClient.generateEmbeddings(texts);
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return null;
  }
}
```

### Using the OpenAI API Directly

```jsx
import { openaiApi } from '@/services/api';

// In a component or service
async function generateResponseWithOpenAI(prompt) {
  try {
    const response = await openaiApi.createChatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ]
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response with OpenAI:', error);
    return null;
  }
}

// Generate an image with DALL-E
async function generateImageWithOpenAI(prompt) {
  try {
    const response = await openaiApi.generateImage({
      prompt,
      n: 1,
      size: '1024x1024'
    });
    
    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    return null;
  }
}
```

### Using the Deepseek API Directly

```jsx
import { deepseekApi } from '@/services/api';

// In a component or service
async function generateResponseWithDeepseek(prompt) {
  try {
    const response = await deepseekApi.createChatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ]
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response with Deepseek:', error);
    return null;
  }
}

// Generate embeddings with Deepseek
async function generateEmbeddingsWithDeepseek(texts) {
  try {
    const response = await deepseekApi.createEmbeddings({
      input: texts
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating embeddings with Deepseek:', error);
    return null;
  }
}
```

### Creating a custom API instance

```jsx
import { createApi } from '@/services/api';

// Create a custom API instance
const myApi = createApi('https://api.example.com', {
  headers: {
    'X-Custom-Header': 'custom-value'
  },
  onUnauthorized: () => {
    // Handle unauthorized access
    window.location.href = '/login';
  }
});

// Using the custom API
async function fetchData() {
  try {
    const data = await myApi.get('/endpoint');
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
```

### Creating a new API class for a specific service

```jsx
import { BaseApi } from '@/services/api';

class WeatherApi extends BaseApi {
  constructor(apiKey) {
    super('https://api.weatherservice.com', {
      headers: {
        'X-API-Key': apiKey
      }
    });
  }
  
  async getCurrentWeather(location) {
    return this.get(`/weather?location=${encodeURIComponent(location)}`);
  }
  
  async getForecast(location, days = 5) {
    return this.get(`/forecast?location=${encodeURIComponent(location)}&days=${days}`);
  }
}

// Usage
const weatherApi = new WeatherApi('your-api-key');
const forecast = await weatherApi.getForecast('New York');
``` 