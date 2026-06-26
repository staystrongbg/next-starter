'use client';

import { useState } from 'react';

export const usePasswordVisibility = () => {
  const [visibility, setVisibility] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggle = (field: keyof typeof visibility) =>
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));

  return {
    isPasswordVisible: visibility.password,
    togglePasswordVisibility: () => toggle('password'),
    isNewPasswordVisible: visibility.newPassword,
    toggleNewPasswordVisibility: () => toggle('newPassword'),
    isConfirmPasswordVisible: visibility.confirmPassword,
    toggleConfirmPasswordVisibility: () => toggle('confirmPassword'),
  };
};
