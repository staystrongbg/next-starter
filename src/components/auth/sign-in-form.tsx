'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { SubmitButton } from '../submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { ShowPassword } from './show-password';

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const SignInForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
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
      router.push('/');
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    signIn(data);
  };
  return (
    <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {error && <FieldError className="text-red-500" errors={[error]} />}

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your email"
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <div className="relative flex items-center">
                <Input
                  {...field}
                  id="password"
                  type={isVisible ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="off"
                />
                <ShowPassword isVisible={isVisible} onClick={() => setIsVisible(!isVisible)} />
              </div>
              {fieldState.invalid && (
                <FieldError className="text-red-500" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <SubmitButton
          variant={'outline'}
          label="Sign In"
          loadingLabel="Signing in..."
          isLoading={isPending}
        />
      </FieldGroup>
    </form>
  );
};
