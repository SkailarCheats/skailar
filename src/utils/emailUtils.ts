import { resend } from '../webhooks';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

interface OTP {
	code: string;
	expiresAt: string;
}

interface SendEmailOptions {
	to: string;
	subject: string;
	text: string;
}

export function generateOTP(): OTP {
	const otp = randomBytes(3).toString('hex').slice(0, 6).toUpperCase();
	const expiresAt = addMinutes(new Date(), 10).toISOString(); // OTP expires in 10 minutes
	return { code: otp, expiresAt };
}

export function validateOTP(otp: string, storedOtp: string, expiration: string): boolean {
	if (new Date() > new Date(expiration)) return false;
	return otp === storedOtp;
}

export async function sendEmail({ to, subject, text }: SendEmailOptions): Promise<void> {
	try {
		await resend.emails.send({
			from: 'no-reply@skailar.com',
			to,
			subject,
			text
		});
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Failed to send email');
	}
}

async function sendOTPEmail(email: string, otp: string): Promise<void> {
	await sendEmail({
		to: email,
		subject: 'Your OTP Code',
		text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
	});
}
