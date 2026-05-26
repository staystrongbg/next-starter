'use client';

import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '../ui/button';

export const GuestSession = () => {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!session.data) {
    const buttonClassName = 'bg-blue-500 hover:bg-blue-600';

    return (
      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="default" size="default" className={buttonClassName}>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="default" size="default" className={buttonClassName}>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  // Signed in state
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-gray-600">Welcome back, </span>
      <span className="font-medium">{session.data.user?.name ?? 'User'}</span>
    </div>
  );
};

const buttonStyles = 'bg-blue-500 hover:bg-blue-600';
