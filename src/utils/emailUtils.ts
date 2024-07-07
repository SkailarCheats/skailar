import { resend } from '../webhooks';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

export interface OTP {
	code: string;
	expiresAt: string;
}

interface SendEmailOptions {
	to: string;
	subject: string;
	text?: string;
	html: string
}

export function generateOTP(): OTP {
	const otp = randomBytes(3).toString("hex").slice(0, 6).toUpperCase()
	const expiresAt = addMinutes(new Date(), 10).toISOString(); // OTP expires in 10 minutes
	return { code: otp, expiresAt };
}

export function validateOTP(otp: string, storedOtp: string, expiration: string): boolean {
	if (new Date() > new Date(expiration)) return false;
	return otp === storedOtp;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
	try {
		await resend.emails.send({
			from: 'no-reply@skailar.com',
			to,
			subject,
			html
		});
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Failed to send email');
	}
}

export async function sendNewsletterEmail(email: string, name?: string) {
	const htmlContent = `
	<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Skailar Newsletter<div></div>
  </div>

<body style="background-color:#dbddde;">
	<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
		style="max-width:37.5em;margin:30px auto;background-color:#fff;border-radius:5px;overflow:hidden">
		<tbody>
			<tr style="width:100%">
				<td>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
						<tbody>
							<tr>
								<td>
									<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
										<tbody style="width:100%">
											<tr style="width:100%">
												<td data-id="__react-email-column"><img alt="Skailar Logo" height="155"
														src="https://cdn.skailar.com/v1/assets/img/logo.png"
														style="display:block;outline:none;border:none;text-decoration:none;padding:0 40px"
														width="155" /></td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
						style="padding:0 40px">
						<tbody>
							<tr>
								<td>
									<hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e8eaed;margin:20px 0" />
									<p style="font-size:18px;line-height:26px;margin:16px 0;font-weight:700;color:#004dcf">WELCOME TO
										SKAILAR!</p>
									<p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">Hello ${name ? name : email},</p>
									<p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">Thank you for subscribing to
										the Skailar newsletter. We are thrilled to have you with us.</p>
									<p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">At Skailar, we strive to bring
										you the latest updates and insights from the world of technology. Our newsletter will keep you
										informed about the latest trends, news, and exclusive content.</p>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
						style="padding:0 40px">
						<tbody>
							<tr>
								<td>
									<p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">We look forward to embarking on
										this journey with you. Stay tuned for more exciting updates and insights from Skailar.</p>
									<hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e8eaed;margin:20px 0" />
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
						style="padding:0 40px">
						<tbody>
							<tr>
								<td>
									<p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">Best regards,</p>
									<p style="font-size:20px;line-height:22px;margin:16px 0;color:#3c4043">The Skailar Team</p>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
						style="padding:0 40px;padding-bottom:30px">
						<tbody>
							<tr>
								<td>
									<p style="font-size:12px;line-height:22px;margin:0;color:#3c4043;text-align:center">©
										<script>document.write(new Date().getFullYear())</script> Skailar
										All rights reserved.
									</p>
									<p style="font-size:12px;line-height:22px;margin:0;color:#3c4043;text-align:center">You have received
										this email because you subscribed to the Skailar newsletter.</p>
									<p style="font-size:12px;line-height:22px;margin:0;color:#3c4043;text-align:center">If you no longer
										wish to
										receive these emails, <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/unsubscribe?email=${email}"
											style="color:#004dcf;text-decoration:none;font-size:12px;">click here to unsubscribe</a>.</p>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
  </body>
</html>
	`;

	await sendEmail({
		to: email,
		subject: 'Skailar Newsletter',
		html: htmlContent
	});
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
	await sendEmail({
		to: email,
		subject: 'Your OTP Code',
		html: `Your OTP code is ${otp}. It will expire in 10 minutes.`
	});
}
