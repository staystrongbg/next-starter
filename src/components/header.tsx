import { Navigation } from './navigation';
import { UserSession } from './user-session';

export const Header = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-gray-300 px-4 text-gray-700">
      <Navigation />
      <UserSession />
    </header>
  );
};
