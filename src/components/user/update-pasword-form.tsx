'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getPasswordStrength } from '@/helpers/get-pwd-strength';
import { AuthClientType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { PasswordStrengthMeter } from '../auth/password-strength-meter';
import { TogglePasswordVisibility } from '../auth/toggle-password-visibility';
import { SubmitButton } from '../shared/submit-button';

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

  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [isNewPwdVisible, setIsNewPwdVisible] = useState(false);

  const form = useForm({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const newPasswordValue = form.watch('newPassword');

  const strength = useMemo(() => getPasswordStrength(newPasswordValue), [newPasswordValue]);

  const {
    mutate: changePasswordMutation,
    isPending: isLoading,
    error,
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
      toast.success('Password updated successfully');
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
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Current Password"
                  autoComplete="current-password"
                  type={isPwdVisible ? 'text' : 'password'}
                />
                <TogglePasswordVisibility
                  isVisible={isPwdVisible}
                  onClick={() => setIsPwdVisible(!isPwdVisible)}
                />
              </div>
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
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="New Password"
                  autoComplete="new-password"
                  type={isNewPwdVisible ? 'text' : 'password'}
                />

                <TogglePasswordVisibility
                  isVisible={isNewPwdVisible}
                  onClick={() => setIsNewPwdVisible(!isNewPwdVisible)}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

              {/* Password strength meter */}
              <PasswordStrengthMeter strength={strength} />
            </Field>
          )}
        />
        <SubmitButton
          isLoading={isLoading}
          label="Update Password"
          loadingLabel="Updating Password..."
          disabled={
            isLoading ||
            isError ||
            !form.formState.isValid ||
            !form.formState.isDirty ||
            strength.score < 2
          }
        />
      </FieldGroup>
    </form>
  );
}
