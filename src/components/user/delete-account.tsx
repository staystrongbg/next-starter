'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { SubmitButton } from '../shared/submit-button';

export function DeleteAccount() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.deleteUser();
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      router.push('/');
    },
    onError: error => {
      console.error('Delete account error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    },
  });

  const confirmDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      mutate();
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <SubmitButton
        isLoading={isPending}
        label="Delete Account"
        loadingLabel="Deleting..."
        onClick={confirmDelete}
        variant={'destructive'}
        disabled={isPending}
      />
    </div>
  );
}
