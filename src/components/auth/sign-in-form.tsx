'use client';

import { authClient } from '@/lib/auth-client';
import { signInSchema } from '@/lib/valildations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { SubmitButton } from '../shared/submit-button';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { ForgotPasswordDialog } from './forgot-password-dialog';
import { TogglePasswordVisibility } from './toggle-password-visibility';

export const SignInForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

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
      form.reset();
      router.push(redirect || '/');
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    signIn(data);
  };
  return (
    <>
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
                  <TogglePasswordVisibility
                    isVisible={isVisible}
                    onClick={() => setIsVisible(!isVisible)}
                  />
                </div>
                <p className="text-sm">
                  Forgot Password?{' '}
                  <Link href="#" onClick={() => setOpen(true)} className="text-blue-500">
                    Click here
                  </Link>
                </p>
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
      <div className="mt-2 flex items-center justify-center p-2">
        <p>Or sign in with</p>
        <Button
          className="cursor-pointer"
          type="button"
          variant={'ghost'}
          onClick={() => authClient.signIn.social({ provider: 'google' })}
        >
          <Image src="/google-178-svgrepo-com.svg" alt="Google" width={20} height={20} />
          Google
        </Button>

        <Button
          className="cursor-pointer"
          type="button"
          variant={'ghost'}
          onClick={() => authClient.signIn.social({ provider: 'github' })}
        >
          <Image src="/github-142-svgrepo-com.svg" alt="GitHub" width={20} height={20} />
          GitHub
        </Button>
      </div>
      <ForgotPasswordDialog open={open} onOpen={setOpen} />
    </>
  );
};
