'use client';

import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';

export const UserSession = () => {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <div className="text-sm text-gray-700">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (!session?.data?.user) {
    return <div className="text-sm text-gray-700">Not signed in</div>;
  }
  return <div className="text-sm text-gray-700">{session.data.user.email}</div>;
};
