'use server';

import nodemailer from 'nodemailer';

import { emailFrom, gmailServicePassword } from './constants';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailFrom,
    pass: gmailServicePassword,
  },
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
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', error);
    return;
  }
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
}
