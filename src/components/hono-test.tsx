'use client';

import { honoClient } from '@/lib/hono/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

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

  if (isPending)
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="text-center text-2xl font-bold text-green-500">
      {data.echo} @ {data.at}
    </div>
  );
}
