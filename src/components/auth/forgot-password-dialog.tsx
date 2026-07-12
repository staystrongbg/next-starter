'use client';

import { useForgotPassword } from '@/app/hooks/use-forgot-password';
import { SubmitButton } from '@/components/shared/submit-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';

export const ForgotPasswordDialog = () => {
  const { form, isLoading, error, onSubmit, open, setDialogOpen } = useForgotPassword();

  return (
    <Dialog
      open={open}
      onOpenChange={newOpen => {
        if (!newOpen) {
          form.reset();
        }
        setDialogOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className="cursor-pointer text-blue-500">
          Click here
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgot Password?</DialogTitle>
          <DialogDescription>
            Enter your email address and we will send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {error && (
            <FieldError
              errors={[
                error?.message ? error : { message: 'Something went wrong. Please try again.' },
              ]}
            />
          )}
          <FieldGroup>
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
            <SubmitButton
              isLoading={isLoading}
              label="Send Reset Link"
              loadingLabel="Sending Reset Link..."
              disabled={isLoading}
            />
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};
