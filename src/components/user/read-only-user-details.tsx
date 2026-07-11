'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import { CheckIcon, Mail } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

export const ReadOnlyUserDetails = () => {
  const { data } = authClient.useSession();

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={data?.user.image || undefined}
          alt="user-avatar"
          className="object-cover"
        />
        <AvatarFallback className="text-lg">
          {generateUserAvatar({ user: data?.user })}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">{data?.user.name}</h2>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          <span>{data?.user.email}</span>
          {data?.user.emailVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <CheckIcon className="h-3 w-3" />
              Verified
            </span>
          ) : (
            <Button variant="link" size="sm" asChild>
              <Link
                href="/verify-email"
                className="flex items-center gap-1 text-xs text-orange-600"
              >
                <Mail className="h-4 w-4" />
                Verify email
              </Link>
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Member since{' '}
        <span className="font-medium text-gray-700">
          {data?.user.createdAt?.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </p>
    </div>
  );
};
