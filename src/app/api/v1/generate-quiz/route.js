import { NextResponse } from 'next/server';
import { aiClient } from '@/services/api';

/**
 * POST handler for quiz generation API endpoint
 * 
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} - JSON response with generated quiz or error
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      prompt, 
      // model = 'deepseek-chat', 
      options = {} } = body;
    
    // Validate the request
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid prompt for the quiz' },
        { status: 400 }
      );
    }
    
    // Generate the quiz using the AI client
    const quiz = await aiClient.generateQuiz(prompt, {
      // model,
      response_format: {
        type: "json_object"
      },
      ...options
    });
    
    // console.log(quiz);

    // Return the generated quiz
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
} 