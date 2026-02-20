import { z } from 'zod';

/**
 * Zod schema for contact form validation.
 * Mirrors server-side validation in google-apps-script/Code.gs.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long (max 100 characters)')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Email is too long (max 254 characters)')
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject is too long (max 200 characters)')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long (max 5000 characters)')
    .trim(),
  /** Honeypot field — hidden from humans, bots fill it */
  company_url: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export function isApiResponse(data: unknown): data is ApiResponse {
  if (typeof data !== 'object' || data === null) return false;
  const record = data as Record<string, unknown>;
  return 'success' in record && typeof record['success'] === 'boolean';
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';
