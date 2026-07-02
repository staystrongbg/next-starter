import { ThemeToggle } from '../shared/theme-toggle';
import { UserDropdown } from '../user/user-dropdown';
import { Navigation } from './navigation';

export const Header = () => {
  return (
    <header className="bg-muted text-foreground flex h-16 w-full items-center justify-between px-2 lg:px-8">
      <Navigation />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
};
