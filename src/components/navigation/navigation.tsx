'use client';

import { LINKS } from '@/lib/client-constants';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {LINKS.map(item => {
        const isActive = item.href === pathname;
        return (
          <Link key={item.label} href={item.href as Route} className={isActive ? 'text-violet-700' : ''}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
