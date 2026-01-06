'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { User } from 'better-auth';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

export const ReadOnlyUserDetails = ({ user }: { user: User }) => {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <Avatar>
        <AvatarImage src={user?.image || undefined} alt="user-avatar" />
        <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
      </Avatar>
      <p className="font-semibold">{user?.name}</p>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{user?.email}</p>
        <div className="text-xs">
          {user?.emailVerified ? (
            <div className="flex items-center text-green-500">
              <CheckIcon />
              <span>Verified</span>
            </div>
          ) : (
            <Link href="/verify-email">
              <Button variant="link" size={'sm'} type="button">
                Verify email
              </Button>
            </Link>
          )}
        </div>
      </div>
      <p>
        Joined <span className="font-semibold">{user?.createdAt.toDateString()}</span>
      </p>
    </div>
  );
};
