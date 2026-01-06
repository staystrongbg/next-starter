import { SignInForm } from '@/components/auth/sign-in-form';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function SignIn() {
  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">Sign In</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}
