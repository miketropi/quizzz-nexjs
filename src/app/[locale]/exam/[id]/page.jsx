import ExamClientPage from './ExamClientPage';
import { notFound } from 'next/navigation';


// get quiz data from API endpoint instead of directly from Firebase
const getQuizData = async (id) => {
  try {

    // Use fetch API to make a server-side request to our API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');
    const url = `${baseUrl}/api/v1/quiz/${id}`;
    
    const response = await fetch(url, { 
      cache: 'no-store' // Ensure we always get fresh data
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        // Return 404 to trigger notFound for non-existent quiz
        notFound();
      }
      throw new Error(`Failed to load quiz data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};


// server component for data fetching
export default async function ExamServerPage({ params }) {
  try {
    const { id } = await params;
    const quizData = await getQuizData(id);
    return <ExamClientPage quizData={quizData} id={id} />
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}
