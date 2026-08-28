'use server';

import nodemailer from 'nodemailer';

import { gmailServicePassword, nodemailerEmail } from './constants';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: nodemailerEmail,
    pass: gmailServicePassword,
  },
});

// Verify once at startup (non-blocking). Do not verify per-send.
// Failures are logged; sendMail will still throw on actual send attempt so
// Better Auth can propagate a 500 instead of silently succeeding.
transporter.verify().catch(error => {
  console.error('[send-email] Transporter verification failed at startup:', error);
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: email,
      to: sendTo,
      subject: subject,
      text: text ? text : '',
      html: html ? html : '',
    });
    console.log('Message Sent', info.messageId);
    console.log('Mail sent to', sendTo);
    return info;
  } catch (error) {
    console.error('[send-email] Failed to send email to', sendTo, error);
    // Propagate so Better Auth / callers return 500 and do not silently succeed
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
