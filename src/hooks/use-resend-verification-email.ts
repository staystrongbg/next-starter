'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useResendVerificationEmail = () => {
  const session = authClient.useSession();

  return useMutation({
    mutationFn: async () => {
      const email = session.data?.user.email;
      if (!email) {
        throw new Error('No email found');
      }
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/profile',
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Verification email sent', {
        position: 'top-center',
        duration: 3000,
      });
    },
    onError: err => {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    },
  });
};
