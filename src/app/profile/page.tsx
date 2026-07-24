import { Skeleton } from '@/components/ui/skeleton';
import { UserDetails } from '@/components/user/user-details';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile settings',
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
        </div>
        <div className="p-6">
          <Suspense fallback={<ProfilePageSkeleton />}>
            <UserDetails />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const ProfilePageSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
};
