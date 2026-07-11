import { GuestSession } from '../auth/guest-session';
import { ThemeToggle } from '../shared/theme-toggle';
import { UserDropdown } from '../user/user-dropdown';
import { Navigation } from './navigation';

export const Header = () => {
  return (
    <header className="border-border bg-background text-foreground flex h-16 w-full items-center justify-between border-b px-2 lg:px-8">
      <Navigation />
      <div className="flex items-center gap-2">
        <GuestSession />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
};
