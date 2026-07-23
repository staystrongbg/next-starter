'use client';

import { useResendVerificationEmail } from '@/hooks/use-resend-verification-email';
import { authClient } from '@/lib/auth-client';
import { CheckCircle } from 'lucide-react';

import { SubmitButton } from '../shared/submit-button';

export default function ResendVerificationLink() {
  const { data: session } = authClient.useSession();
  const { mutate: resendVerification, isPending: isLoading, error } = useResendVerificationEmail();

  const isVerified = session?.user?.emailVerified;

  const errorMessage =
    error instanceof Error ? error.message : typeof error === 'string' ? error : undefined;

  return (
    <>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="flex flex-col items-center gap-4">
        {isVerified ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
            <p className="text-center text-gray-600">Email verified</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Please check your email for the verification link.
          </p>
        )}
      </div>
      {!isVerified && (
        <SubmitButton
          label="Send Verification Link"
          type="button"
          loadingLabel="Sending..."
          isLoading={isLoading}
          onClick={() => resendVerification()}
        />
      )}
    </>
  );
}
