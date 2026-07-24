import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useDeleteAccount() {
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

  return {
    deleteUser: mutate,
    isLoading: isPending,
    confirmDelete,
  };
}
