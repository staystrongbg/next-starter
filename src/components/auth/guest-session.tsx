'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export const GuestSession = () => {
  const session = authClient.useSession();

  if (session.isPending)
    return (
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-8 w-20 bg-gray-300" />
        <Skeleton className="h-8 w-20 bg-gray-300" />
      </div>
    );

  if (!session.data) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }
  return null;
};
