'use client';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

import { Button } from './ui/button';

export const Navigation = () => {
  const session = authClient.useSession();
  return (
    <nav className="flex items-center gap-2">
      {!session.data?.user && (
        <>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
      {session.data?.user && (
        <Button variant="outline" onClick={() => authClient.signOut()}>
          Sign Out
        </Button>
      )}
    </nav>
  );
};
