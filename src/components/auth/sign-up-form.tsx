'use client';

import { usePasswordVisibility } from '@/app/hooks/use-password-visibility';
import { useSignUp } from '@/app/hooks/use-signup';
import { getPasswordStrength } from '@/helpers/get-pwd-strength';
import { Controller, useWatch } from 'react-hook-form';

import { SubmitButton } from '../shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { PasswordStrengthMeter } from './password-strength-meter';
import { TogglePasswordVisibility } from './toggle-password-visibility';

export const SignUpForm = () => {
  const {
    isPasswordVisible,
    togglePasswordVisibility,
    isConfirmPasswordVisible,
    toggleConfirmPasswordVisibility,
  } = usePasswordVisibility();

  const { form, onSubmit, isLoading, error } = useSignUp();

  const newPasswordValue = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  });
  const strength = getPasswordStrength(newPasswordValue);
  return (
    <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {error && (
          <FieldError
            errors={[
              error?.message ? error : { message: 'Something went wrong. Please try again.' },
            ]}
          />
        )}

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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex flex-col gap-2">
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
                    type={isPasswordVisible ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                  />
                  <TogglePasswordVisibility
                    isVisible={isPasswordVisible}
                    onClick={togglePasswordVisibility}
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {newPasswordValue && <PasswordStrengthMeter strength={strength} />}
        </div>
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
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm your password"
                  autoComplete="off"
                />
                <TogglePasswordVisibility
                  isVisible={isConfirmPasswordVisible}
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <SubmitButton
          variant={'outline'}
          label="Sign Up"
          loadingLabel="Signing up..."
          isLoading={isLoading}
          disabled={isLoading}
        />
      </FieldGroup>
    </form>
  );
};
