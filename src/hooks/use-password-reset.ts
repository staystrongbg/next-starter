'use client';

import { authClient } from '@/lib/auth-client';
import { resetPasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useToken } from './use-token';

export const usePasswordReset = () => {
  const token = useToken();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
    },
  });

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (data: z.infer<typeof resetPasswordSchema>) => {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      toast.success('Password reset successfully');
      router.push('/sign-in');
    },
    onError: err => {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => reset());
    return () => subscription.unsubscribe();
  }, [form, reset]);

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    mutate(data);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
    error,
  };
};
