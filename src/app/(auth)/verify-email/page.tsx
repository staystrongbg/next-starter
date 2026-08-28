import ResendEmailVerification from '@/components/auth/resend-verification-link';
import { requireUserSession } from '@/lib/require-user-session';
import { Loader2 } from 'lucide-react';
import { unauthorized } from 'next/navigation';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-16 items-center justify-center" aria-live="polite" aria-busy="true">
          <Loader2 className="animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

async function VerifyEmailContent() {
  const session = await requireUserSession();

  if (!session) {
    return unauthorized();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Verify Your Email</h1>
      <ResendEmailVerification />
    </div>
  );
}
