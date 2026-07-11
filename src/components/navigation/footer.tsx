'use client';

export const Footer = () => {
  const currentYear = new Date().getFullYear().toString();
  return (
    <footer className="border-border bg-background text-foreground flex h-16 w-full items-center justify-center border-t">
      <p>© {currentYear} Next.js Starter Kit. All rights reserved.</p>
    </footer>
  );
};
