'use client';

import { LINKS } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {LINKS.map(item => {
        const isActive = item.href === pathname;
        return (
          <Link key={item.label} href={item.href} className={isActive ? 'text-blue-500' : ''}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
