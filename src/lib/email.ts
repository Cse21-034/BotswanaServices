import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_EMAIL = 'noreply@namibiaservices.com';

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const result = await resend.emails.send({ from: FROM_EMAIL, to, subject, react });
    return { success: true, result };
  } catch (error) {
    console.error('[Email] Failed to send to', to, ':', error);
    return { success: false, error };
  }
}
