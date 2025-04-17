import LoginForm from '../../../components/LoginForm';

export const metadata = {
  title: 'Sign Up - Quizzz',
  description: 'Create a new Quizzz account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8" style={{ marginTop: '10vh' }}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <LoginForm isSignUpDefault={true} />
      </div>
    </div>
  );
} 