'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
    return <div className="text-sm text-gray-700">Hello Guest</div>;
  }

  const user = { name: session.data.user.name, email: session.data.user.email };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src={session.data.user.image || 'https://github.com/shadcn.png'}
            alt="user-avatar"
          />
          <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button variant="ghost">
            <Link href="/profile">
              <div className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </div>
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant="ghost" onClick={() => authClient.signOut()}>
            <div className="flex items-center">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign Out
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
