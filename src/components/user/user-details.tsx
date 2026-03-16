'use client';

import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import { unauthorized } from 'next/navigation';

import { ChangeUserDetails } from './change-user-details';
import { ReadOnlyUserDetails } from './read-only-user-details';

export const UserDetails = () => {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!session.data) {
    return unauthorized();
  }

  return (
    <>
      <ReadOnlyUserDetails user={session.data.user} />
      <ChangeUserDetails />
    </>
  );
};
