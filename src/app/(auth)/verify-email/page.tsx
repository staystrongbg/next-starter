import ResendEmailVerification from '@/components/auth/resend-verification-link';
import { requireUserSession } from '@/lib/require-user-session';
import { unauthorized } from 'next/navigation';

export default function VerifyEmailPage() {
  const session = requireUserSession();

  if (!session) {
    return unauthorized();
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <ResendEmailVerification />
      </div>
    </>
  );
}
