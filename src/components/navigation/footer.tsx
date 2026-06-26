'use client';

export const Footer = () => {
  const currentYear = new Date().getFullYear().toString();
  return (
    <footer className="bg-muted flex h-16 w-full items-center justify-center">
      <p>© {currentYear} Next.js Starter Kit. All rights reserved.</p>
    </footer>
  );
};
