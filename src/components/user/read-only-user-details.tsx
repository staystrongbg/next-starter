'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

export const ReadOnlyUserDetails = () => {
  const session = authClient.useSession();

  if (!session.data) {
    return null;
  }

  if (session.isPending) {
    return <div>Loading...</div>;
  }

  const user = session.data.user;

  return (
    <section>
      <div className="mt-4 flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage
            src={session.data?.user?.image || 'https://github.com/shadcn.png'}
            alt="user-avatar"
          />
          <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
        </Avatar>
        <p>Name: {session?.data?.user?.name}</p>
        <p>
          Email: {session?.data?.user?.email}{' '}
          <span className="text-xs">
            {session?.data?.user?.emailVerified ? (
              <span className="text-green-500">Verified</span>
            ) : (
              <Link href="/verify-email">
                <Button variant="link" size={'sm'} type="button">
                  Verify email
                </Button>
              </Link>
            )}
          </span>
        </p>
        <p>Date joined: {session?.data?.user?.createdAt.toDateString()}</p>
      </div>
    </section>
  );
};
