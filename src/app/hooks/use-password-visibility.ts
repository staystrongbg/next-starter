'use client';

import { useState } from 'react';

export const usePasswordVisibility = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  return {
    isPasswordVisible,
    togglePasswordVisibility,
    isNewPasswordVisible,
    toggleNewPasswordVisibility,
  };
};
