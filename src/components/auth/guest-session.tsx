'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const linkStyle = 'underline hover:underline-offset-4';

export const GuestSession = () => {
  const session = authClient.useSession();

  if (session.isPending) {
    return null;
  }

  if (!session.data) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Link className={linkStyle} href="/sign-up">
          Sign Up
        </Link>
        <span>|</span>
        <Link className={linkStyle} href="/sign-in">
          Sign In
        </Link>
      </div>
    );
  }

  return null;
};
