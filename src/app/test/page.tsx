import { EchoGet } from '@/components/hono-test';

export default function TestPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <EchoGet />
    </div>
  );
}
