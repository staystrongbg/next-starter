'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const UserDropdown = () => {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <div className="text-sm text-gray-700">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!session.data?.user) {
    return null;
  }

  const { user } = session.data;

  const logOut = async () => {
    await authClient.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />
          <AvatarFallback>
            {generateUserAvatar({ user: { name: user.name, email: user.email } })}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex cursor-pointer items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut} className="flex cursor-pointer items-center">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
