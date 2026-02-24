import { z } from 'zod';
import { APP_STAGES } from '../models/Application.js';

const optionalDate = z
  .string()
  .datetime({ offset: true })
  .or(z.literal(''))
  .or(z.null())
  .optional();

const optionalUrl = z
  .string()
  .trim()
  .url('Job URL must be a valid URL')
  .or(z.literal(''))
  .optional();

export const applicationSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(100, 'Company is too long'),
  roleTitle: z.string().trim().min(1, 'Role title is required').max(120, 'Role title is too long'),
  location: z.string().trim().max(120, 'Location is too long').optional(),
  jobUrl: optionalUrl,
  stage: z.enum(APP_STAGES).optional(),
  appliedDate: optionalDate,
  followUpDate: optionalDate,
  notes: z.string().trim().max(3000, 'Notes are too long').optional()
});

export const applicationUpdateSchema = applicationSchema.partial();
