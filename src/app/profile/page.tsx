import { UserDetails } from '@/components/user/user-details';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="text-center text-2xl font-semibold">Profile</h2>
      <UserDetails />
    </div>
  );
}

//TODO delete account
