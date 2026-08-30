'use client';

import { useDeleteAccount } from '@/hooks/use-delete-account';
import { useState } from 'react';

import { SubmitButton } from '../shared/submit-button';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export function DeleteAccount() {
  const { isLoading, deleteUser } = useDeleteAccount();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-6">
      <p className="text-muted-foreground text-sm">
        Permanently delete your account and all associated data. This action cannot be undone.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading} aria-haspopup="dialog">
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and remove your data. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton
              isLoading={isLoading}
              label="Delete Account"
              loadingLabel="Deleting..."
              onClick={() => {
                setOpen(false);
                deleteUser();
              }}
              variant="destructive"
              disabled={isLoading}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
