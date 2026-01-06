import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-center text-2xl font-bold">Reset Password</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
