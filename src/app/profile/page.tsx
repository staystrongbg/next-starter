import { UserDetails } from '@/components/user/user-details';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile settings',
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
        </div>
        <div className="p-6">
          <UserDetails />
        </div>
      </div>
    </div>
  );
}
