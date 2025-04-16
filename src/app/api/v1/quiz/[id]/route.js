import { NextResponse } from 'next/server';
import quizService from '@/services/quizService';
/**
 * GET handler for quiz retrieval by ID
 * This provides a secure server-side endpoint to fetch quiz data
 * 
 * @param {Request} request - The incoming request object
 * @param {Object} params - URL parameters containing quiz ID
 * @returns {Promise<NextResponse>} - JSON response with quiz data or error
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch quiz data using the service
    const quiz = await quizService.getQuizById(id); 
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    // Return the quiz data
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    
    // Handle Firebase permission errors
    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { error: 'You do not have permission to access this quiz' },
        { status: 403 }
      );
    }
    
    // Handle other Firebase errors
    if (error.code) {
      return NextResponse.json(
        { error: `Firebase error: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Return generic error response
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
} 