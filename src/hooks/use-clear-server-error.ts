'use client';

import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export const useClearServerError = <T extends FieldValues>(
  form: UseFormReturn<T>,
  reset: () => void,
  error?: Error | null,
) => {
  useEffect(() => {
    const subscription = form.watch(() => {
      // Clear server error when user starts typing
      if (error) {
        reset();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, reset, error]);
};
