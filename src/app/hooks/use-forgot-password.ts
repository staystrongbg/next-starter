'use client';

import { authClient } from '@/lib/auth-client';
import { forgotPasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
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

  const mutation = useMutation({
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
      form.reset();
      setDialogOpen(false);
      toast.success('Password reset link sent');
    },
  });

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    mutation.mutate(data);
  };

  const setDialogOpen = (value: boolean) => {
    setOpen(value);
  };

  return {
    form,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    onSubmit,
    open,
    setDialogOpen,
  };
};
