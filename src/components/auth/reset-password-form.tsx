'use client';

import { usePasswordVisibility } from '@/app/hooks/use-password-visibility';
import { useToken } from '@/app/hooks/use-token';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { TogglePasswordVisibility } from '@/components/auth/toggle-password-visibility';
import { SubmitButton } from '@/components/shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getPasswordStrength } from '@/helpers/get-pwd-strength';
import { authClient } from '@/lib/auth-client';
import { MIN_PASSWORD_STRENGTH_SCORE } from '@/lib/constants';
import { resetPasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const ResetPasswordForm = () => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const token = useToken();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
    },
  });

  const {
    mutate: resetPasswordMutation,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof resetPasswordSchema>) => {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      toast.success('Password reset successfully');
      router.push('/sign-in');
    },
  });
  const newPasswordValue = form.watch('newPassword');
  const strength = getPasswordStrength(newPasswordValue);

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && <FieldError className="text-red-500" errors={[error]} />}

      <FieldGroup>
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
                  type={isPasswordVisible ? 'text' : 'password'}
                />

                <TogglePasswordVisibility
                  isVisible={isPasswordVisible}
                  onClick={togglePasswordVisibility}
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
            !form.formState.isValid ||
            !form.formState.isDirty ||
            strength.score < MIN_PASSWORD_STRENGTH_SCORE
          }
        />
      </FieldGroup>
    </form>
  );
};
