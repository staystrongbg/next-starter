'use client';

import { authClient } from '@/lib/auth-client';
import { ChevronDownIcon, ImageIcon, Lock, Mail, UserCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import UpdateEmailForm from './update-email-form';
import UpdateImageForm from './update-image-form';
import { UpdateNameForm } from './update-name-form';
import UpdatePasswordForm from './update-pasword-form';

const sections = [
  { id: 'password', label: 'Password', icon: Lock, component: UpdatePasswordForm },
  { id: 'email', label: 'Email Address', icon: Mail, component: UpdateEmailForm },
  { id: 'name', label: 'Display Name', icon: UserCircle, component: UpdateNameForm },
  { id: 'image', label: 'Profile Picture', icon: ImageIcon, component: UpdateImageForm },
];

export const ChangeUserDetails = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Account Settings</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
        />
      </Button>

      {isOpen && (
        <div className="mt-6 space-y-6">
          {sections.map((section, index) => {
            const FormComponent = section.component;
            const Icon = section.icon;
            return (
              <div key={section.id}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{section.label}</h3>
                </div>
                <div className="mt-3 pl-11">
                  <FormComponent authClient={authClient} />
                </div>
                {index < sections.length - 1 && <Separator className="mt-6" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
