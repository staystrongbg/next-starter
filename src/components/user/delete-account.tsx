'use client';

import { useDeleteAccount } from '@/hooks/use-delete-account';

import { SubmitButton } from '../shared/submit-button';

export function DeleteAccount() {
  const { isLoading, confirmDelete } = useDeleteAccount();

  return (
    <div className="flex flex-col space-y-6">
      <SubmitButton
        isLoading={isLoading}
        label="Delete Account"
        loadingLabel="Deleting..."
        onClick={confirmDelete}
        variant={'destructive'}
        disabled={isLoading}
      />
    </div>
  );
}
