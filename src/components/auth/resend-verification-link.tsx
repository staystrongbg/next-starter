'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { unauthorized } from 'next/navigation';
import { toast } from 'sonner';

import { SubmitButton } from '../shared/submit-button';
import { Skeleton } from '../ui/skeleton';

export default function ResendVerificationLink() {
  const session = authClient.useSession();

  const {
    mutate: resendVerification,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.sendVerificationEmail({
        email: session.data?.user.email || '',
        callbackURL: '/profile',
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Verification email sent successfully', {
        position: 'top-center',
        duration: 3000,
      });
    },
  });

  if (session.isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
        <Skeleton className="h-10 w-42 bg-gray-200" />
        <Skeleton className="h-10 w-36 bg-gray-200" />
      </div>
    );
  }

  if (!session.data) {
    return unauthorized();
  }

  const isVerified = session.data.user.emailVerified;

  return (
    <>
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="flex flex-col items-center gap-4">
        {isVerified ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
            <p className="text-center text-gray-600">Email verified successfully.</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Please check your email for the verification link.
          </p>
        )}
      </div>
      <SubmitButton
        label="Send Verification Link"
        type="button"
        loadingLabel="Sending..."
        isLoading={isPending}
        disabled={isPending || isVerified}
        onClick={() => resendVerification()}
      />
    </>
  );
}
