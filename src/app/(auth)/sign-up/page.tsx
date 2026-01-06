import { SignUpForm } from '@/components/auth/sign-up-form';
import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">Sign Up</h1>
      <SignUpForm />
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
