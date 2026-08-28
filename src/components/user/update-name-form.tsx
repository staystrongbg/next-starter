'use client';

import { authClient } from '@/lib/auth-client';
import { updateNameSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SubmitButton } from '../shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

export const UpdateNameForm = () => {
  const session = authClient.useSession();
  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
    mode: 'onChange',
    defaultValues: {
      name: session.data?.user?.name || '',
    },
  });

  // Ensure form reflects session updates
  useEffect(() => {
    if (session.data?.user?.name) {
      form.reset({ name: session.data.user.name });
    }
  }, [session.data?.user?.name, form]);

  const {
    mutate: updateNameMutation,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof updateNameSchema>) => {
      const { error } = await authClient.updateUser({ name: data.name });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Name updated successfully');
      session.refetch();
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || 'Failed to update name');
    },
  });

  const onSubmit = (data: z.infer<typeof updateNameSchema>) => {
    updateNameMutation(data);
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

  const hasName = Boolean(session.data.user.name);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} aria-busy={isLoading} noValidate>
      {!!error && (
        <FieldError
          errors={[{ message: (error as Error)?.message || 'Something went wrong' }]}
          role="alert"
        />
      )}
      {!hasName && (
        <p className="text-muted-foreground mb-2 text-sm" role="status">
          No display name set yet — add one below.
        </p>
      )}
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                placeholder="Enter display name"
                type="text"
                autoComplete="name"
                className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id={`${field.name}-error`} role="alert" />
              )}
            </Field>
          )}
        />

        <SubmitButton
          label="Update Name"
          loadingLabel="Updating..."
          isLoading={isLoading}
          disabled={isLoading || !form.formState.isValid || !form.formState.isDirty}
        />
      </FieldGroup>
    </form>
  );
};
