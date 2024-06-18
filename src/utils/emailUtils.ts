import { getPayloadClient } from "../get-payload";
import { resend } from "../webhooks";

export async function sendOTPByEmail(email: string, otp: string) {
	const from = 'no-reply@skailar.com';
	const subject = 'Your OTP for Login';
	const text = `Your OTP (One-Time Password) for login is: ${otp}`;

	try {
		await resend.emails.send({
			to: email,
			from,
			subject,
			text
		});

		console.log(`OTP sent to ${email} successfully.`);
	} catch (error) {
		console.error(`Error sending OTP to ${email}:`, error);
		throw new Error(`Failed to send OTP to ${email}`);
	}
}

export const generateOTP = () => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Genera come stringa
	return otp;
};

export const generateAndSendOTP = async (email: string) => {
	const otp = generateOTP();
	const payload = await getPayloadClient()

	await payload.update({
		collection: 'users',
		data: {
			twoFASecret: otp,
		},
		where: {
			email: {
				equals: email
			}
		}
	});
	await sendOTPByEmail(email, otp);
};