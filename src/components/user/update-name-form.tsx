'use client';

import { updateNameSchema } from '@/lib/valildations';
import { AuthClientType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SubmitButton } from '../shared/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

export const UpdateNameForm = ({ authClient }: AuthClientType) => {
  const session = authClient.useSession();
  const form = useForm({
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
    isError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof updateNameSchema>) => {
      const { error } = await authClient.updateUser({ name: data.name });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      toast.success('Name updated successfully');
    },
  });

  const onSubmit = (data: z.infer<typeof updateNameSchema>) => {
    updateNameMutation(data);
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && <FieldError errors={[error]} />}
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
                placeholder={field.name}
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <SubmitButton
          label="Update Name"
          loadingLabel="Updating..."
          isLoading={isLoading || isError}
          disabled={isLoading}
        />
      </FieldGroup>
    </form>
  );
};
