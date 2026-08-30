'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getPasswordStrength } from '@/helpers/get-pwd-strength';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';
import { authClient } from '@/lib/auth-client';
import { MIN_PASSWORD_STRENGTH_SCORE } from '@/lib/client-constants';
import { updatePasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { PasswordStrengthMeter } from '../auth/password-strength-meter';
import { TogglePasswordVisibility } from '../auth/toggle-password-visibility';
import { SubmitButton } from '../shared/submit-button';

export default function UpdatePasswordForm() {
  const session = authClient.useSession();

  const {
    isPasswordVisible,
    togglePasswordVisibility,
    isNewPasswordVisible,
    toggleNewPasswordVisibility,
  } = usePasswordVisibility();

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const newPasswordValue = useWatch({
    control: form.control,
    name: 'newPassword',
    defaultValue: '',
  });

  const strength = useMemo(() => getPasswordStrength(newPasswordValue), [newPasswordValue]);

  const {
    mutate: changePasswordMutation,
    isPending: isLoading,
    error,
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
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || 'Failed to update password');
    },
  });

  const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    changePasswordMutation(data);
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
        No user session found. Please sign in.
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} aria-busy={isLoading} noValidate>
      {!!error && (
        <FieldError
          errors={[{ message: (error as Error)?.message || 'Something went wrong' }]}
          role="alert"
        />
      )}

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
                  aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                  placeholder="Current Password"
                  autoComplete="current-password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                <TogglePasswordVisibility
                  isVisible={isPasswordVisible}
                  onClick={togglePasswordVisibility}
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id={`${field.name}-error`} role="alert" />
              )}
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
                  aria-describedby={
                    fieldState.error ? `${field.name}-error` : `${field.name}-strength`
                  }
                  placeholder="New Password"
                  autoComplete="new-password"
                  type={isNewPasswordVisible ? 'text' : 'password'}
                  className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
                />

                <TogglePasswordVisibility
                  isVisible={isNewPasswordVisible}
                  onClick={toggleNewPasswordVisibility}
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id={`${field.name}-error`} role="alert" />
              )}

              {/* Password strength meter - always visible for consistent UX */}
              <div id={`${field.name}-strength`}>
                <PasswordStrengthMeter strength={strength} />
              </div>
              {newPasswordValue && strength.score < MIN_PASSWORD_STRENGTH_SCORE && (
                <p className="text-destructive text-xs" role="alert">
                  Password too weak — add mixed case, numbers or symbols.
                </p>
              )}
            </Field>
          )}
        />
        <SubmitButton
          isLoading={isLoading}
          label="Update Password"
          loadingLabel="Updating Password..."
          disabled={
            isLoading ||
            !form.formState.isValid ||
            !form.formState.isDirty ||
            strength.score < MIN_PASSWORD_STRENGTH_SCORE
          }
        />
      </FieldGroup>
    </form>
  );
}
