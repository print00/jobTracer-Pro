import { z } from 'zod';

const email = z.string().trim().email('Enter a valid email');
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80, 'Name is too long'),
  email,
  password
});

export const loginSchema = z.object({
  email,
  password
});
