import { ChangeUserDetails } from '@/components/user/change-user-details';
import { ReadOnlyUserDetails } from '@/components/user/read-only-user-details';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="text-center text-2xl font-semibold">Profile</h2>
      <ReadOnlyUserDetails />
      <ChangeUserDetails />
    </div>
  );
}

//TODO delete account
