'use client';

import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { TogglePasswordVisibility } from '@/components/auth/toggle-password-visibility';
import { SubmitButton } from '@/components/shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getPasswordStrength } from '@/helpers/get-pwd-strength';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  newPassword: z.string().trim().min(8, 'New password must be at least 8 characters long'),
});

export const ResetPasswordForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token')!;
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
    isError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof resetPasswordSchema>) => {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token: token!,
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
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
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
};
