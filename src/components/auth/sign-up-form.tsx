'use client';

import { authClient } from '@/lib/auth-client';
import { signupSchema } from '@/lib/valildations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { SubmitButton } from '../shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { TogglePasswordVisibility } from './toggle-password-visibility';

export const SignUpForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
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
    },
  });

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    signUp(data);
  };
  return (
    <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {error && <FieldError className="text-red-500" errors={[error]} />}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your name"
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

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
                <TogglePasswordVisibility
                  isVisible={isVisible}
                  onClick={() => setIsVisible(!isVisible)}
                />
              </div>
              {fieldState.invalid && (
                <FieldError className="text-red-500" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <div className="relative flex items-center">
                <Input
                  {...field}
                  id="confirmPassword"
                  type={isConfirmVisible ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm your password"
                  autoComplete="off"
                />
                <TogglePasswordVisibility
                  isVisible={isConfirmVisible}
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                />
              </div>
              {fieldState.invalid && (
                <FieldError className="text-red-500" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <SubmitButton
          variant={'outline'}
          label="Sign Up"
          loadingLabel="Signing up..."
          isLoading={isPending}
        />
      </FieldGroup>
    </form>
  );
};
