import ExamClientPage from './ExamClientPage';
import { notFound } from 'next/navigation';
import ModalLogin from './ModalLogin';
// nextjs cookies
import { cookies } from 'next/headers';
import admin from '@/firebase-admin';
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
export default async function ExamServerPage(context) {
  try {
    
    const { id } = await context.params; 
    const cookiesList = await cookies();
    const token = cookiesList.get('token')?.value;

    // check if user is logged in 
    if (!token) {
      // load form login
      return <>
        <ModalLogin />
        <p> </p>
      </>
    }

    // check if user is logged in  
    const decodedToken = await admin.auth().verifyIdToken(token); 
    const user = await admin.auth().getUser(decodedToken.uid);

    // check if user is logged in 
    if (!decodedToken) {
      // load form login
      return <>
        <ModalLogin />
        <p> </p>
      </>
    }
    
    const quizData = await getQuizData(id);

    // check status of quiz not is public
    if (quizData.status !== 'public') {
      notFound();
    }

    return <ExamClientPage quizData={quizData} id={id} />
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}
