'use client';

import { authClient } from '@/lib/auth-client';
import { signupSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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

  const mutation = useMutation({
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
  });

  const onSubmit = (data: z.infer<typeof signupSchema>) => mutation.mutate(data);

  return {
    form,
    mutation,
    onSubmit,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
