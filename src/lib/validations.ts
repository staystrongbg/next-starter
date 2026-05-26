import { z } from 'zod';

const signInSchema = z.object({
  email: z.email('Invalid email format').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const signupSchema = z
  .object({
    name: z.string().min(3).trim(),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const resetPasswordSchema = z.object({
  newPassword: z.string().trim().min(8, 'New password must be at least 8 characters long'),
});

const forgotPasswordSchema = z.object({
  email: z.email().trim().min(1, 'Email is required'),
});

const updateEmailSchema = z.object({
  newEmail: z.email('Invalid email').trim().toLowerCase(),
});

const updateImageSchema = z.object({
  image: z.instanceof(File).optional().nullable(),
});

const updateNameSchema = z.object({
  name: z.string().trim().min(3, 'Name is required.'),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .nonempty('Current password is required')
      .min(8, 'Must be at least 8 characters'),
    newPassword: z.string().trim().min(8, 'New password must be at least 8 characters long'),
  })
  .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signupSchema,
  updateEmailSchema,
  updateImageSchema,
  updateNameSchema,
  updatePasswordSchema,
};
