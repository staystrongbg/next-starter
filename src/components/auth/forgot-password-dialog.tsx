'use client';

import { SubmitButton } from '@/components/shared/submit-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { forgotPasswordSchema } from '@/lib/valildations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpen: (open: boolean) => void;
}

export const ForgotPasswordDialog = ({ open, onOpen }: ForgotPasswordDialogProps) => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const {
    mutate: forgotPasswordMutation,
    isPending: isLoading,
    error,
    isError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof forgotPasswordSchema>) => {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      });
      if (error) {
        throw error;
      }
    },

    onSuccess: () => {
      form.reset();
      onOpen(false);
      toast.success('Password reset link sent');
    },
  });

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordMutation(data);
  };
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgot Password?</DialogTitle>
          <DialogDescription>
            Enter your email address and we will send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {error && <FieldError className="text-red-500" errors={[error]} />}
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
                  {fieldState.invalid && (
                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <SubmitButton
              isLoading={isLoading}
              label="Send Reset Link"
              loadingLabel="Sending Reset Link..."
              disabled={isLoading || isError}
            />
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};
