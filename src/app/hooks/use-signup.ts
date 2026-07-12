'use client';

import { authClient } from '@/lib/auth-client';
import { signupSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const useSignUp = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (data: z.infer<typeof signupSchema>) => {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      router.push('/sign-in');
      form.reset();
    },
    onError: err => {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => reset());
    return () => subscription.unsubscribe();
  }, [form, reset]);

  const onSubmit = (data: z.infer<typeof signupSchema>) => mutate(data);

  return {
    form,
    mutation: { mutate, isPending, error, reset },
    onSubmit,
    isLoading: isPending,
    error,
  };
};
