interface GenerateUserAvatarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export const generateUserAvatar = ({ user }: GenerateUserAvatarProps) => {
  const userInitials =
    user?.name
      ?.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase() ||
    user?.email?.split('@')[0]?.substring(0, 2).toUpperCase();

  return userInitials || 'U';
};
