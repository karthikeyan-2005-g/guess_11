import { z } from 'zod';

export const registerSchema = z
  .object({
    userId: z
      .string()
      .min(3, 'User ID must be at least 3 characters')
      .max(20, 'User ID cannot exceed 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'User ID can only contain letters, numbers, and underscores'),
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .max(25, 'Username cannot exceed 25 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    avatar: z.string().default('avatar-1'),
    fullName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  userId: z.string().min(1, 'User ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const updateProfileSchema = z.object({
  username: z.string().min(2).max(25).optional(),
  avatar: z.string().optional(),
  fullName: z.string().max(50).optional(),
  bio: z.string().max(160).optional(),
  favoriteCategory: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Must contain at least one letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Must contain at least one letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export const createRoomSchema = z.object({
  name: z.string().min(1).max(30).default('Game Room 11'),
  gameMode: z.enum(['NORMAL', 'DOUBLE11', 'SPEED', 'HARD', 'MYSTERY']).default('NORMAL'),
  roundDuration: z.number().int().min(30).max(180).default(90),
});
