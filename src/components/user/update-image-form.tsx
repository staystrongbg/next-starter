'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { AuthClientType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SubmitButton } from '../submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const updateImageSchema = z.object({
  image: z.instanceof(File).optional().nullable(),
  name: z.string().trim().min(3, 'Name is required.'),
});

export default function UpdateImageForm({ authClient }: AuthClientType) {
  const session = authClient.useSession();

  const form = useForm({
    resolver: zodResolver(updateImageSchema),
    mode: 'onChange',
    defaultValues: {
      name: session?.data?.user?.name || '',
      image: null,
    },
  });

  //ensure form reflects session update
  useEffect(() => {
    if (session.data?.user.name) {
      form.reset({ name: session.data.user.name, image: null });
    }
  }, [session.data?.user.name, form]);

  const {
    mutate: updateImageMutation,
    isPending: isLoading,
    error,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof updateImageSchema>) => {
      let imageUrl: string | undefined;
      const file = data.image ?? undefined;
      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        imageUrl = base64;
      }
      const { error } = await authClient.updateUser({
        name: data.name,
        image: imageUrl,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      session.refetch();
      form.reset({ name: session.data?.user?.name ?? '', image: null });
    },
  });

  const onSubmit = async (data: z.infer<typeof updateImageSchema>) => {
    updateImageMutation(data);
  };

  if (session.isPending) {
    return <div>Loading...</div>;
  }

  if (!session.data) {
    return null;
  }

  const user = session.data.user;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && <FieldError errors={[error]} />}
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{field.name}</FieldLabel>
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

        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => {
            const { value, ...fieldProps } = field;
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Change Image
                  <Avatar>
                    <AvatarImage
                      src={session.data?.user?.image || 'https://github.com/shadcn.png'}
                      alt="user-avatar"
                    />
                    <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
                  </Avatar>
                </FieldLabel>
                <Input
                  {...fieldProps}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={field.name}
                  type="file"
                  accept="image/*"
                  onChange={e => field.onChange(e.target.files?.[0] || null)}
                  hidden
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
        <SubmitButton
          isLoading={isLoading}
          label="Update Image"
          loadingLabel="Updating image..."
          disabled={isError || isLoading || !form.formState.isValid}
        />
      </FieldGroup>
      {isSuccess && <p className="text-green-500">Image updated successfully.</p>}
    </form>
  );
}
