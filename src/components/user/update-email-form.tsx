'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateEmailSchema } from '@/lib/valildations';
import { AuthClientType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SubmitButton } from '../shared/submit-button';

export default function UpdateEmailForm({ authClient }: AuthClientType) {
  const session = authClient.useSession();

  const form = useForm({
    resolver: zodResolver(updateEmailSchema),
    mode: 'onChange',
    defaultValues: {
      newEmail: session.data?.user.email || '',
    },
  });

  //ensure form reflects session update
  useEffect(() => {
    if (session.data?.user.email) {
      form.reset({ newEmail: session.data.user.email });
    }
  }, [session.data?.user.email, form]);

  const {
    mutate: changeEmailMutation,
    isPending: isLoading,
    error,
    isError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof updateEmailSchema>) => {
      const { error } = await authClient.changeEmail({
        newEmail: data.newEmail,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Email updated successfully');
      session.refetch();
    },
  });
  const onSubmit = async (data: z.infer<typeof updateEmailSchema>) => {
    changeEmailMutation(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && <FieldError errors={[error]} />}
      <FieldGroup>
        <Controller
          name="newEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="New Email"
                autoComplete="off"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <SubmitButton
          variant={'default'}
          isLoading={isLoading}
          label="Update Email"
          loadingLabel="Updating email..."
          disabled={isError || isLoading || !form.formState.isValid}
        />
      </FieldGroup>
    </form>
  );
}
