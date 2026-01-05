'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import UpdateEmailForm from './update-email-form';
import UpdateImageForm from './update-image-form';
import { UpdateNameForm } from './update-name-form';
import UpdatePasswordForm from './update-pasword-form';

export const ChangeUserDetails = () => {
  const [onClose, setOnClose] = useState(true);

  return (
    <div className="mt-8 max-w-xl">
      <Button variant="outline" className="w-full" onClick={() => setOnClose(!onClose)}>
        Change
      </Button>
      {!onClose && (
        <section className="mt-8 flex flex-col gap-8">
          {/* pass reset */}
          <div>
            <h3 className="text-center text-lg font-semibold">Change Password</h3>
            <UpdatePasswordForm authClient={authClient} />
          </div>
          <Separator />
          {/* email update */}
          <div>
            <h3 className="text-center text-lg font-semibold">Change Email</h3>
            <UpdateEmailForm authClient={authClient} />
          </div>
          <Separator />
          {/* update name form */}
          <div>
            <h3 className="text-center text-lg font-semibold">Change Name</h3>
            <UpdateNameForm authClient={authClient} />
          </div>
          <Separator />
          {/* update image form*/}
          <div>
            <h3 className="text-center text-lg font-semibold">Change Image</h3>
            <UpdateImageForm authClient={authClient} />
          </div>
          <Separator />
        </section>
      )}
    </div>
  );
};
