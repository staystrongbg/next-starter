'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import { updateImageSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SubmitButton } from '../shared/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function UpdateImageForm() {
  const session = authClient.useSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateImageSchema>>({
    resolver: zodResolver(updateImageSchema),
    mode: 'onChange',
    defaultValues: {
      image: null,
    },
  });

  const hasImage = Boolean(session.data?.user?.image);

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    form.setValue('image', null, { shouldValidate: true });
  };

  const {
    mutate: updateImageMutation,
    isPending: isLoading,
    error,
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
      toast.success(hasImage ? 'Image updated successfully' : 'Image added successfully');
      session.refetch();
      clearPreview();
      form.reset({ image: null });
    },
  });

  const { mutate: removeImageMutation, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.updateUser({
        image: null,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Image removed');
      session.refetch();
      clearPreview();
      form.reset({ image: null });
    },
    onError: err => {
      toast.error(err?.message || 'Something went wrong. Please try again.');
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
                <Avatar className="size-16">
                  <AvatarImage
                    src={previewUrl || user.image || undefined}
                    alt="user-avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>{generateUserAvatar({ user }) || 'U'}</AvatarFallback>
                </Avatar>

                <span className="flex flex-col gap-2">
                  <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                    <ImagePlus />
                    {hasImage ? 'Change Image' : 'Add Image'}
                  </Button>

                  {hasImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeImageMutation()}
                      disabled={isRemoving}
                    >
                      {isRemoving ? <Loader2 className="animate-spin" /> : <Trash2 />}
                      Remove Image
                    </Button>
                  )}
                </span>

                <Input
                  ref={inputRef}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
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
              </span>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {previewUrl && (
          <SubmitButton
            label={hasImage ? 'Update Image' : 'Upload Image'}
            loadingLabel="Uploading..."
            isLoading={isLoading}
            disabled={!form.formState.isValid}
          />
        )}
      </FieldGroup>
    </form>
  );
}
