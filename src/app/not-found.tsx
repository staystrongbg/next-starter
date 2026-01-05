import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center gap-2 text-center text-2xl">
      <p> 404 - Not Found</p>
      <p className="text-gray-500">Page you are looking for does not exist</p>
      <Button variant={'default'} type="button" asChild>
        <Link href="/">Go to Home Page</Link>
      </Button>
    </div>
  );
}
