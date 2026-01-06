'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { User } from 'better-auth';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

export const ReadOnlyUserDetails = ({ user }: { user: User }) => {
  return (
    <section>
      <div className="mt-4 flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src={user?.image || '/user-fallback-image.jpeg'} alt="user-avatar" />
          <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
        </Avatar>
        <p>Name: {user?.name}</p>
        <p>
          Email: {user?.email}{' '}
          <span className="text-xs">
            {user?.emailVerified ? (
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
        <p>Date joined: {user?.createdAt.toDateString()}</p>
      </div>
    </section>
  );
};
