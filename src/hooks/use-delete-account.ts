import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useDeleteAccount() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.deleteUser();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      router.push('/');
    },
    onError: error => {
      console.error('Delete account error:', error);
      toast.error((error as Error).message || 'Something went wrong. Please try again.');
    },
  });

  // Dialog-based confirmation is handled in DeleteAccount component.
  // Keeping confirmDelete as deprecated alias for backwards compat.
  const confirmDelete = () => mutate();

  return {
    deleteUser: mutate,
    isLoading: isPending,
    confirmDelete,
  };
}
