'use client';

import { useState } from 'react';

export const usePasswordVisibility = () => {
  const [field, setField] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggle = (key: keyof typeof field) => setField(prev => ({ ...prev, [key]: !prev[key] }));

  return {
    isPasswordVisible: field.password,
    togglePasswordVisibility: () => toggle('password'),
    isNewPasswordVisible: field.newPassword,
    toggleNewPasswordVisibility: () => toggle('newPassword'),
    isConfirmPasswordVisible: field.confirmPassword,
    toggleConfirmPasswordVisibility: () => toggle('confirmPassword'),
  };
};
