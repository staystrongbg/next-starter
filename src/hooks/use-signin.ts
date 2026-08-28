/* eslint-disable react-hooks/set-state-in-effect -- hydration from localStorage requires sync setState on mount */
'use client';

import { authClient } from '@/lib/auth-client';
import { signInSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useClearServerError } from './use-clear-server-error';
import { useRedirect } from './use-redirect';

// Attempt limit constants: 5 fails → 15 min lock
// TODO (backend): enforce this server-side via rate-limit (Redis / DB) in auth hooks/middleware.
// Client-side lock is UX only and can be bypassed; backend must be source of truth.
// Suggested server: track failed attempts per IP+email in DB or Better Auth `before` hook, return 429 with Retry-After.
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY_ATTEMPTS = 'signin_attempts';
const STORAGE_KEY_LOCK_UNTIL = 'signin_lock_until';

export const useSignIn = () => {
  const router = useRouter();
  const redirect = useRedirect();

  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Hydrate attempts/lock from storage (client only)
  useEffect(() => {
    const storedAttempts = Number(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0');
    const storedLock = Number(localStorage.getItem(STORAGE_KEY_LOCK_UNTIL) || '0');
    if (!Number.isNaN(storedAttempts)) setAttempts(storedAttempts);
    if (storedLock && storedLock > Date.now()) {
      setLockUntil(storedLock);
    } else if (storedLock && storedLock <= Date.now()) {
      // expired lock → clear
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
      setAttempts(0);
      setLockUntil(null);
    }
  }, []);

  // Tick for countdown while locked
  useEffect(() => {
    if (!lockUntil || lockUntil <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockUntil]);

  const isLocked = useMemo(() => !!lockUntil && lockUntil > now, [lockUntil, now]);
  const remainingMs = useMemo(
    () => (lockUntil ? Math.max(0, lockUntil - now) : 0),
    [lockUntil, now],
  );
  const remainingMinSec = useMemo(() => {
    const totalSec = Math.ceil(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }, [remainingMs]);

  const persistAttempts = useCallback((nextAttempts: number, nextLockUntil: number | null) => {
    setAttempts(nextAttempts);
    setLockUntil(nextLockUntil);
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, String(nextAttempts));
    if (nextLockUntil) {
      localStorage.setItem(STORAGE_KEY_LOCK_UNTIL, String(nextLockUntil));
    } else {
      localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
    }
  }, []);

  const clearAttempts = useCallback(() => {
    persistAttempts(0, null);
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
  }, [persistAttempts]);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (data: z.infer<typeof signInSchema>) => {
      if (isLocked) {
        throw new Error(`Too many attempts. Try again in ${remainingMinSec}.`);
      }
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      clearAttempts();
      form.reset();
      router.push((redirect || '/') as Route);
    },
    onError: err => {
      const message = (err as Error)?.message || 'Something went wrong. Please try again.';
      toast.error(message);

      const nextAttempts = attempts + 1;
      if (nextAttempts >= MAX_ATTEMPTS) {
        const nextLock = Date.now() + LOCK_DURATION_MS;
        persistAttempts(nextAttempts, nextLock);
        toast.error(`Too many failed attempts. Account locked for 15 minutes.`);
      } else {
        persistAttempts(nextAttempts, null);
        if (MAX_ATTEMPTS - nextAttempts <= 2) {
          toast.error(`${MAX_ATTEMPTS - nextAttempts} attempt(s) left before lockout.`);
        }
      }
    },
  });

  useClearServerError(form, reset, error);

  const onSubmit = form.handleSubmit(data => {
    if (isLocked) {
      toast.error(`Too many attempts. Try again in ${remainingMinSec}.`);
      return;
    }
    mutate(data);
  });

  return {
    form,
    mutation: { mutate, isPending, error, reset },
    onSubmit,
    isLoading: isPending,
    error,
    isLocked,
    remainingMs,
    remainingMinSec,
    attempts,
  };
};
