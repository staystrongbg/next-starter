'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AuthClientType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SubmitButton } from '../submit-button';

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .nonempty('Current password is required')
      .min(8, 'Must be at least 8 characters'),
    newPassword: z.string().trim().min(8, 'New password must be at least 8 characters long'),
  })
  .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export default function UpdatePasswordForm({ authClient }: AuthClientType) {
  const session = authClient.useSession();

  const form = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const {
    mutate: changePasswordMutation,
    isPending: isLoading,
    error,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof updatePasswordSchema>) => {
      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      form.reset({
        currentPassword: '',
        newPassword: '',
      });
      session.refetch();
    },
  });

  const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    changePasswordMutation(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && <FieldError className="text-red-500" errors={[error]} />}

      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Current Password"
                autoComplete="current-password"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="New Password"
                autoComplete="new-password"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <SubmitButton
          isLoading={isLoading}
          label="Update Password"
          loadingLabel="Updating Password..."
          disabled={isLoading || isError || !form.formState.isValid}
        />
      </FieldGroup>

      {isSuccess && <p className="text-green-500">Password updated successfully.</p>}
    </form>
  );
}
