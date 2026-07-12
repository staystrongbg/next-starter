import { useToken } from '@/app/hooks/use-token';
import { authClient } from '@/lib/auth-client';
import { resetPasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const usePasswordReset = () => {
  const token = useToken();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
    },
  });

  const {
    mutate: resetPasswordMutation,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof resetPasswordSchema>) => {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      toast.success('Password reset successfully');
      router.push('/sign-in');
    },
  });

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation(data);
  };

  return {
    form,
    onSubmit,
    isLoading,
    error,
  };
};
