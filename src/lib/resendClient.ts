import 'server-only';
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = 'noreply@namibiaservices.com';
export const MARKETING_EMAIL = 'marketing@namibiaservices.com';
