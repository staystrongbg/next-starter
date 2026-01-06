import type { User } from 'better-auth';

interface GenerateUserAvatarProps {
  user?: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'image'>;
}

export const generateUserAvatar = ({ user }: GenerateUserAvatarProps) => {
  const userInitials =
    user?.name
      ?.split(' ')
      .map(name => name[0])
      .join('') || user?.email?.split('@')[0].substring(0, 2).toUpperCase();

  return userInitials || 'U';
};
