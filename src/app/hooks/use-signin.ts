'use client';

import { authClient } from '@/lib/auth-client';
import { signInSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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

  const mutation = useMutation({
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
  });

  const onSubmit = form.handleSubmit(data => mutation.mutate(data));

  return {
    form,
    mutation,
    onSubmit,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
