'use client';

import { authClient } from '@/lib/auth-client';
import { signInSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useRedirect } from './use-redirect';

export const useSignIn = () => {
  const router = useRouter();
  const { redirect } = useRedirect();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (data: z.infer<typeof signInSchema>) => {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      router.push(redirect || '/');
    },
    onError: err => {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => reset());
    return () => subscription.unsubscribe();
  }, [form, reset]);

  const onSubmit = form.handleSubmit(data => mutate(data));

  return {
    form,
    mutation: { mutate, isPending, error, reset },
    onSubmit,
    isLoading: isPending,
    error,
  };
};
