'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { updateEmailSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckIcon, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SubmitButton } from '../shared/submit-button';

export default function UpdateEmailForm() {
  const session = authClient.useSession();

  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    mode: 'onChange',
    defaultValues: {
      newEmail: session.data?.user.email || '',
    },
  });

  //ensure form reflects session update
  useEffect(() => {
    if (session.data?.user.email) {
      form.reset({ newEmail: session.data.user.email });
    }
  }, [session.data?.user.email, form]);

  const {
    mutate: changeEmailMutation,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof updateEmailSchema>) => {
      const { error } = await authClient.changeEmail({
        newEmail: data.newEmail,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Verification email sent. Please check your new email.');
      session.refetch();
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || 'Failed to update email');
    },
  });
  const onSubmit = async (data: z.infer<typeof updateEmailSchema>) => {
    changeEmailMutation(data);
  };

  if (session.isPending) {
    return (
      <div className="flex h-16 items-center justify-center" aria-live="polite" aria-busy="true">
        <Loader2 className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="text-muted-foreground py-4 text-center text-sm" role="status">
        No user found. Please sign in again.
      </div>
    );
  }

  const isVerified = session.data.user.emailVerified;
  const currentEmail = session.data.user.email;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} aria-busy={isLoading} noValidate>
      {!!error && (
        <FieldError
          errors={[{ message: (error as Error)?.message || 'Something went wrong' }]}
          role="alert"
        />
      )}
      <FieldGroup>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Current:</span>
          <span className="font-medium">{currentEmail}</span>
          {isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
              <CheckIcon className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Unverified
            </span>
          )}
        </div>

        <Controller
          name="newEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                placeholder="New Email"
                autoComplete="email"
                type="email"
                className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id={`${field.name}-error`} role="alert" />
              )}
            </Field>
          )}
        />
        <SubmitButton
          variant="default"
          isLoading={isLoading}
          label="Update Email"
          loadingLabel="Updating email..."
          disabled={isLoading || !form.formState.isValid || !form.formState.isDirty}
        />
        <p className="text-muted-foreground text-xs">
          You&apos;ll receive a verification link at the new address.
        </p>
      </FieldGroup>
    </form>
  );
}
