# Generate Quiz API

This endpoint allows you to generate a quiz using AI based on a given prompt.

## Endpoint

```
POST /api/v1/generate-quiz
```

## Request Body

| Parameter | Type   | Required | Description                                |
|-----------|--------|----------|--------------------------------------------|
| prompt    | string | Yes      | The topic or description for the quiz      |
| model     | string | No       | AI model to use (default: 'deepseek-chat') |
| options   | object | No       | Additional options for quiz generation     |

### Example Request

```json
{
  "prompt": "Create a quiz about JavaScript basics",
  "model": "deepseek-chat",
  "options": {
    "temperature": 0.7
  }
}
```

## Response

### Success Response

```json
{
  "title": "JavaScript Basics Quiz",
  "description": "Test your knowledge of JavaScript fundamentals",
  "questions": [
    {
      "id": "q1",
      "question": "What keyword is used to declare a variable in JavaScript?",
      "options": {
        "A": "var",
        "B": "let",
        "C": "const",
        "D": "All of the above"
      },
      "correctAnswer": "D",
      "explanation": "JavaScript provides var, let, and const keywords for variable declaration."
    },
    // More questions...
  ],
  "createdAt": "2023-07-01T12:34:56.789Z"
}
```

### Error Response

```json
{
  "error": "Failed to generate quiz"
}
```

## Usage

Here's how to use this endpoint from your frontend:

```javascript
async function generateQuiz(prompt) {
  try {
    const response = await fetch('/api/v1/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
``` 