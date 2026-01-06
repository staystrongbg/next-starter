import { UserDropdown } from '../user/user-dropdown';
import { Navigation } from './navigation';

export const Header = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-gray-300 px-2 text-gray-700 lg:px-8">
      <Navigation />
      <UserDropdown />
    </header>
  );
};
