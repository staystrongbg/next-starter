'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import { uploadImage, validateImageFile } from '@/lib/upload';
import { updateImageSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

  // Revoke preview URL on unmount or when previewUrl changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
        // Client validation: size max 2MB and mime image/*
        const validationError = validateImageFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        // NOTE: User.image should store a URL (Vercel Blob / S3), not base64.
        // uploadImage abstracts storage; currently falls back to base64 for dev.
        // See src/lib/upload.ts — swap to blob/S3 in production to avoid DB bloat.
        imageUrl = await uploadImage(file);
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
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      toast.error(message);
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
      toast.error((err as Error)?.message || 'Something went wrong. Please try again.');
    },
  });

  const onSubmit = async (data: z.infer<typeof updateImageSchema>) => {
    updateImageMutation(data);
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
        No user session found. Please sign in.
      </div>
    );
  }

  const user = session.data.user;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} aria-busy={isLoading} noValidate>
      {!!error && (
        <FieldError
          errors={[{ message: (error as Error)?.message || 'Something went wrong' }]}
          role="alert"
        />
      )}
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
                    <ImagePlus aria-hidden="true" />
                    {hasImage ? 'Change Image' : 'Add Image'}
                  </Button>

                  {hasImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeImageMutation()}
                      disabled={isRemoving}
                      aria-busy={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 aria-hidden="true" />
                      )}
                      Remove Image
                    </Button>
                  )}
                </span>

                <Input
                  ref={inputRef}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null;

                    // Client validation: size max 2MB and mime image/*
                    if (file) {
                      const validationError = validateImageFile(file);
                      if (validationError) {
                        toast.error(validationError);
                        form.setError('image', { type: 'manual', message: validationError });
                        // clear input
                        e.target.value = '';
                        return;
                      }
                      form.clearErrors('image');
                      const url = URL.createObjectURL(file);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setPreviewUrl(url);
                    } else {
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                    field.onChange(file);
                  }}
                  hidden
                />
              </span>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id={`${field.name}-error`} />
              )}
            </Field>
          )}
        />

        {previewUrl && (
          <SubmitButton
            label={hasImage ? 'Update Image' : 'Upload Image'}
            loadingLabel="Uploading..."
            isLoading={isLoading}
            disabled={!form.formState.isValid || isLoading}
          />
        )}
      </FieldGroup>
    </form>
  );
}
