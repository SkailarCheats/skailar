import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

export default function Page() {
	const faqs = [
		{
			question: 'What products does Skailar offer?',
			answer: <>Skailar offers a range of products tailored to different customer needs. For more details, visit our <Link className="text-purple-500 font-semibold hover:underline" href="/products">Products</Link> page.</>
		},
		{
			question: 'How can I check the status of Skailar services?',
			answer: <>You can check the current status of our services by visiting <Link className="text-purple-500 font-semibold hover:underline" href="https://status.skailar.com/status/cheats">Skailar Status</Link>.</>
		},
		{
			question: 'How do I purchase Skailar products?',
			answer: <>To learn how to purchase Skailar products, visit our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/purchasing/how-to-purchase-skailar">How to Purchase</Link> guide.</>
		},
		{
			question: 'What payment methods are accepted?',
			answer: <>We accept various payment methods. For a detailed list, check our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/purchasing/accepted-payment-methods">Accepted Payment Methods</Link> page.</>
		},
		{
			question: 'What is the refund policy?',
			answer: <>Our refund policies are outlined in our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/purchasing/refund-policies">Refund Policies</Link> guide.</>
		},
		{
			question: 'How do I install Skailar products?',
			answer: <>For installation instructions, refer to our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/installation/skailar-installation-guide">Skailar Installation Guide</Link>.</>
		},
		{
			question: 'What are the system requirements?',
			answer: <>Please check the <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/installation/system-requirements">System Requirements</Link> for our products.</>
		},
		{
			question: 'How can I troubleshoot common issues?',
			answer: <>Find solutions to common problems in our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/installation/troubleshooting-common-issues">Troubleshooting Common Issues</Link> guide.</>
		},
		{
			question: 'How do I update Skailar products?',
			answer: <>Instructions for updates and patches can be found in our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/installation/updates-and-patches">Updates and Patches</Link> section.</>
		},
		{
			question: 'How do I contact technical support?',
			answer: <>You can contact technical support through our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/support/contacting-technical-support">Contacting Technical Support</Link> page.</>
		},
		{
			question: 'How do I report an issue?',
			answer: <>To report an issue, follow the steps outlined on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/support/reporting-an-issue">Reporting an Issue</Link> page.</>
		},
		{
			question: 'What are the scheduled maintenance times?',
			answer: <>Information on scheduled maintenance can be found on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/support/scheduled-maintenance">Scheduled Maintenance</Link> page.</>
		},
		{
			question: 'How do I create and manage my account?',
			answer: <>Guidance on creating and managing your account is available on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/management/creating-and-managing-your-account">Creating and Managing Your Account</Link> page.</>
		},
		{
			question: 'How do I recover my password?',
			answer: <>Instructions for password recovery can be found on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/management/password-recovery">Password Recovery</Link> page.</>
		},
		{
			question: 'How do I update my personal information?',
			answer: <>Learn how to update your personal information on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/management/updating-personal-information">Updating Personal Information</Link> page.</>
		},
		{
			question: 'Where can I find information for resellers?',
			answer: <>Resellers can find information on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/resellers/information-for-resellers">Information for Resellers</Link> page.</>
		},
		{
			question: 'How do I become a reseller?',
			answer: <>To become a reseller, please visit our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/resellers/how-to-become-a-reseller">How to Become a Reseller</Link> page.</>
		},
		{
			question: 'How do I manage licenses?',
			answer: <>Guidance on managing licenses can be found on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/resellers/managing-licenses">Managing Licenses</Link> page.</>
		},
		{
			question: 'What are the reselling policies?',
			answer: <>Our reselling policies are detailed on our <Link className="text-purple-500 font-semibold hover:underline" href="https://help.skailar.com/resellers/reselling-policies">Reselling Policies</Link> page.</>
		}
	]

	return (
		<MaxWidthWrapper>
			<section className="bg-background text-foreground">
				<div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
					<div className="mb-8">
						<h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
						<p className="mt-2 text-muted-foreground md:text-lg">
							Get answers to the most common questions about our product. If you can&apos;t find what you&apos;re looking for, feel free to contact us.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{faqs.map((faq, index) => (
							<div className="mt-4" key={index}>
								<Collapsible className="rounded-lg border bg-background p-4 shadow-sm">
									<CollapsibleTrigger className="flex w-full items-center justify-between">
										<h3 className="text-lg font-medium">{faq.question}</h3>
										<div className="h-5 w-5 transition-transform" />
									</CollapsibleTrigger>
									<CollapsibleContent className="pt-4 text-muted-foreground">
										{faq.answer}
									</CollapsibleContent>
								</Collapsible>
							</div>
						))}
					</div>
				</div>
			</section>
		</MaxWidthWrapper>
	)
}
