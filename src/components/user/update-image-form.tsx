'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { AuthClientType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SubmitButton } from '../shared/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const updateImageSchema = z.object({
  image: z.instanceof(File).optional().nullable(),
});

export default function UpdateImageForm({ authClient }: AuthClientType) {
  const session = authClient.useSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    resolver: zodResolver(updateImageSchema),
    mode: 'onChange',
    defaultValues: {
      image: null,
    },
  });

  //ensure form reflects session update
  useEffect(() => {
    if (session.data?.user?.image) {
      form.reset({ image: null });
      setPreviewUrl(null);
    }
  }, [session.data?.user?.image, form]);

  const {
    mutate: updateImageMutation,
    isPending: isLoading,
    error,
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
        image: imageUrl,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Image updated successfully');
      session.refetch();
      form.reset({ image: null });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof updateImageSchema>) => {
    updateImageMutation(data);
  };

  if (session.isPending) {
    return (
      <div className="flex h-16 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
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
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <span className="flex items-center gap-4">
                <FieldLabel htmlFor={field.name}>
                  Change Image
                  <Avatar>
                    <AvatarImage src={previewUrl || user.image || undefined} alt="user-avatar" />
                    <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
                  </Avatar>
                </FieldLabel>
              </span>
              <Input
                ref={inputRef}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={field.name}
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(url);
                  }
                  field.onChange(file || null);
                }}
                hidden
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <SubmitButton
          label="Update Image"
          loadingLabel="Updating..."
          isLoading={isLoading}
          disabled={isError || isLoading || !form.formState.isValid}
        />
      </FieldGroup>
    </form>
  );
}
