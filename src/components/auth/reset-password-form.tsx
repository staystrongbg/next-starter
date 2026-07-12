'use client';

import { usePasswordReset } from '@/app/hooks/use-password-reset';
import { usePasswordVisibility } from '@/app/hooks/use-password-visibility';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { TogglePasswordVisibility } from '@/components/auth/toggle-password-visibility';
import { SubmitButton } from '@/components/shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getPasswordStrength } from '@/helpers/get-pwd-strength';
import { MIN_PASSWORD_STRENGTH_SCORE } from '@/lib/constants';
import { Controller } from 'react-hook-form';

export const ResetPasswordForm = () => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const { form, onSubmit, isLoading, error } = usePasswordReset();

  const newPasswordValue = form.watch('newPassword');
  const strength = getPasswordStrength(newPasswordValue);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && (
        <FieldError
          errors={[error?.message ? error : { message: 'Something went wrong. Please try again.' }]}
        />
      )}

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
