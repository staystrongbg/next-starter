import { requireUserSession } from '@/lib/require-user-session';
import { unauthorized } from 'next/navigation';

import { ChangeUserDetails } from './change-user-details';
import { ReadOnlyUserDetails } from './read-only-user-details';

export const UserDetails = async () => {
  const session = await requireUserSession();

  if (!session) {
    return unauthorized();
  }

  return (
    <>
      <ReadOnlyUserDetails />
      <ChangeUserDetails />
    </>
  );
};
