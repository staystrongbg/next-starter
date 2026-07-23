'use client';

import { useEffect } from 'react';

export const useClearServerError = (form: any, reset: () => void) => {
  useEffect(() => {
    const subscription = form.watch(() => reset());
    return () => subscription.unsubscribe();
  }, [form, reset]);
};
