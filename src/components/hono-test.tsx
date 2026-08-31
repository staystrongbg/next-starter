'use client';

import { honoClient } from '@/lib/hono/client';
import { useQuery } from '@tanstack/react-query';

export function EchoGet() {
  const { data, error, isPending } = useQuery({
    queryKey: ['echo'],
    queryFn: async () => {
      const res = await honoClient.api.hono.echo.$get({
        query: { message: 'ddamajadev was here!' },
      });
      if (!res.ok) throw new Error(`Echo failed: ${res.status}`);
      return res.json();
    },
  });

  if (isPending) return <div>Loading…</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="text-center text-2xl font-bold text-blue-400">
      {data.echo} @ {data.at}
    </div>
  );
}
