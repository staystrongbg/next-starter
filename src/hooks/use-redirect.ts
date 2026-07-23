'use client';

import { useSearchParams } from 'next/navigation';

export const useRedirect = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  return {
    redirect,
  };
};
