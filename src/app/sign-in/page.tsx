import { SignInForm } from '@/components/auth/sign-in-form';
import Link from 'next/link';

export default function SignIn() {
  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Sign In</h1>
      <SignInForm />
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
