'use client';

import { useResendVerificationEmail } from '@/hooks/use-resend-verification-email';
import { authClient } from '@/lib/auth-client';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

import { SubmitButton } from '../shared/submit-button';
import { FieldError } from '../ui/field';

export default function ResendVerificationLink() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { mutate: resendVerification, isPending: isLoading, error } = useResendVerificationEmail();

  const isVerified = session?.user?.emailVerified;

  const errorMessage =
    error instanceof Error ? error.message : typeof error === 'string' ? error : undefined;

  const isExpired =
    !!errorMessage && /expired|invalid.*token|token.*invalid/i.test(errorMessage);

  if (isSessionPending) {
    return (
      <div className="flex h-16 items-center justify-center" aria-live="polite" aria-busy="true">
        <Loader2 className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading session</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4" aria-live="polite">
      {/* Verified state - green CheckCircle */}
      {isVerified ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-green-500" aria-hidden="true" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Email verified</p>
          <p className="text-muted-foreground text-sm">Your email has been successfully verified.</p>
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          Please check your email for the verification link. If you didn&apos;t receive it, you can
          request a new one below.
        </p>
      )}

      {/* Error states */}
      {errorMessage && isExpired ? (
        <FieldError
          errors={[
            {
              message:
                'Verification link has expired or is invalid. Please request a new verification email.',
            },
          ]}
          className="flex items-center gap-2"
        />
      ) : errorMessage ? (
        <FieldError
          errors={[{ message: errorMessage }]}
          className="flex items-center gap-2"
        />
      ) : null}

      {/* Loading / Expired hint with icon */}
      {isExpired && !isVerified && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>Link expired — click below to resend</span>
        </div>
      )}

      {!isVerified && (
        <SubmitButton
          label={isExpired ? 'Resend Verification Link' : 'Send Verification Link'}
          type="button"
          loadingLabel="Sending..."
          isLoading={isLoading}
          disabled={isLoading}
          aria-disabled={isLoading}
          onClick={() => resendVerification()}
        />
      )}
    </div>
  );
}
