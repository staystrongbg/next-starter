import { EchoGet } from '@/components/hono-test';
import { Suspense } from 'react';

export default function TestPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <EchoGet />
      </Suspense>
    </div>
  );
}
