'use client';

import { useSearchParams } from 'next/navigation';

export const useToken = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    throw new Error('Token is required');
  }

  return token;
};
