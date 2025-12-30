import { Button } from '@/components/ui/button';
import { SmileIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          Hello fellow Developer! <SmileIcon className="size-6" />{' '}
        </h3>
      </div>
      <h1 className="text-center text-4xl font-bold">Next.js Starter Kit</h1>
      <p className="text-lg text-gray-600">
        A complete starter template with authentication and database. Built with{' '}
        <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>, <strong>Better Auth</strong>,
        and <strong>Prisma</strong>. <br /> <br /> Starter Kit includes{' '}
        <strong>Tanstack Query</strong> for data fetching and caching, <strong>Zod</strong> for
        validation, and <strong>shadcn/ui</strong> for components.
        <br />
        <br />
        Kit comes with configured <strong>prettier</strong> and <strong>eslint</strong> for
        consistency and better developer experience.
        <br />
        <br />
        Latest <strong>React Compiler</strong> feature is enabled for optimal performance.
      </p>
      <div className="flex items-center justify-center gap-2">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}

//TODO Middleware - Add authentication check and redirect logic and guard
//TODO Other Auth Features like password reset, email verification, etc.
//TODO Add Nodemailer
//TODO Handle session
//
