import Link from 'next/link';

export const Navigation = () => {
  return (
    <nav className="flex items-center gap-2">
      <Link href="/">Home</Link>
    </nav>
  );
};
