'use client';

import { generateUserAvatar } from '@/helpers/generate-user-avatar';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const UserDropdown = () => {
  const session = authClient.useSession();
  const router = useRouter();

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

  const logOut = async () => {
    await authClient.signOut();
    router.push('/sign-in');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage src={session.data.user.image || undefined} alt="user-avatar" />
          <AvatarFallback>{generateUserAvatar({ user })}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/profile">
            <Button variant="ghost">
              <div className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </div>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant="ghost" onClick={logOut}>
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
