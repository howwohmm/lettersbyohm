import { z } from 'zod';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - accepts common formats
const phoneRegex = /^[\d\s\-+()]{6,20}$/;

// Instagram username validation
const instagramRegex = /^[a-zA-Z0-9._]*$/;

export const signupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .refine(val => emailRegex.test(val), 'Please enter a valid email address'),
  
  phone: z.string()
    .min(1, 'Phone is required')
    .max(20, 'Phone must be less than 20 characters')
    .trim()
    .refine(val => phoneRegex.test(val), 'Please enter a valid phone number'),
  
  instagram: z.string()
    .max(50, 'Instagram handle must be less than 50 characters')
    .refine(val => val === '' || instagramRegex.test(val), 'Instagram handle can only contain letters, numbers, periods, and underscores')
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .min(10, 'Please provide a complete address')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  
  likes: z.string().max(200, 'Must be less than 200 characters').optional().or(z.literal('')),
  listening: z.string().max(200, 'Must be less than 200 characters').optional().or(z.literal('')),
  flower: z.string().max(100, 'Must be less than 100 characters').optional().or(z.literal('')),
  colour: z.string().max(50, 'Must be less than 50 characters').optional().or(z.literal('')),
  song: z.string().max(200, 'Must be less than 200 characters').optional().or(z.literal('')),
  language: z.string().max(50, 'Must be less than 50 characters').optional().or(z.literal('')),
  hindiUnderstanding: z.string().max(50, 'Must be less than 50 characters').optional().or(z.literal('')),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Rate limiting utility
const RATE_LIMIT_KEY = 'signup_last_submission';
const RATE_LIMIT_COOLDOWN = 60 * 1000; // 1 minute cooldown between submissions

export const checkRateLimit = (): { allowed: boolean; remainingSeconds: number } => {
  const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
  
  if (!lastSubmission) {
    return { allowed: true, remainingSeconds: 0 };
  }
  
  const elapsed = Date.now() - parseInt(lastSubmission, 10);
  const remaining = RATE_LIMIT_COOLDOWN - elapsed;
  
  if (remaining <= 0) {
    return { allowed: true, remainingSeconds: 0 };
  }
  
  return { allowed: false, remainingSeconds: Math.ceil(remaining / 1000) };
};

export const recordSubmission = (): void => {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
};

// Submission tracking
const SUBMISSION_KEY = 'has_submitted_signup';

export const hasAlreadySubmitted = (): boolean => {
  return localStorage.getItem(SUBMISSION_KEY) === 'true';
};

export const markAsSubmitted = (): void => {
  localStorage.setItem(SUBMISSION_KEY, 'true');
};

// Visit tracking
const VISIT_KEY = 'visit_tracked_session';

export const hasVisitBeenTracked = (): boolean => {
  return sessionStorage.getItem(VISIT_KEY) === 'true';
};

export const markVisitTracked = (): void => {
  sessionStorage.setItem(VISIT_KEY, 'true');
};
