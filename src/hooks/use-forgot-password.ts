'use client';

import { authClient } from '@/lib/auth-client';
import { forgotPasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const useForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (data: z.infer<typeof forgotPasswordSchema>) => {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      });
      if (error) {
        throw error;
      }
    },

    onSuccess: () => {
      setDialogOpen(false);
      form.reset();
      toast.success('Password reset link sent');
    },
    onError: err => {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => reset());
    return () => subscription.unsubscribe();
  }, [form, reset]);

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    mutate(data);
  };

  const setDialogOpen = (value: boolean) => {
    setOpen(value);
  };

  return {
    form,
    isLoading: isPending,
    error,
    isError: !!error,
    onSubmit,
    open,
    setDialogOpen,
  };
};
