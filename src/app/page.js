import { redirect } from 'next/navigation';

// Redirect the root page to the default locale (English)
export default function Home() {
  redirect('/vi');
}
