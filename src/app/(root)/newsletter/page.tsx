"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const NewsletterPage = () => {
	const [email, setEmail] = useState('');
	const [subscribed, setSubscribed] = useState(false);
	const [error, setError] = useState('');

	function isValidEmail(email: string) {
		return /\S+@\S+\.\S+/.test(email);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email) {
			toast.error('Please enter your email.');
			return;
		}

		if (!isValidEmail(email)) {
			toast.error('Email not valid');
			return
		}

		try {
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setSubscribed(true);
				setEmail('');
				setError('');
				toast.success("Thank you for subscribing!")
			} else {
				toast.error('Failed to subscribe. Please try again later.');
			}
		} catch (err) {
			console.error('Error subscribing:', err);
			toast.error('Failed to subscribe. Please try again later.');
		}
	};

	return (
		<div className="w-full bg-background">
			<section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="py-4 text-5xl font-bold tracking-tight text-center text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/50 to-white sm:text-7xl">
						Stay up to date with our newsletter
					</h1>
					<p className="mt-4 text-muted-foreground md:text-xl">
						Subscribe to our newsletter to receive the latest news, updates, and exclusive content.
					</p>
					<form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-xl mx-auto justify-center">
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="flex-1 rounded-l-md border-r-0 focus:border-primary focus:ring-primary"
						/>
						<Button type="submit" className="rounded-r-md -ml-3 rounded-l-none">
							Subscribe
						</Button>
					</form>
				</div>
			</section>
			<section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
				<div className="mx-auto max-w-3xl">
					<div className="grid gap-8 md:grid-cols-2">
						<div>
							<h2 className="text-3xl font-bold tracking-tighter">What&apos;s in the newsletter?</h2>
							<p className="mt-4 text-muted-foreground md:text-lg">
								Our newsletter covers a wide range of topics, including industry news, product updates, and exclusive content. You&apos;ll receive the latest insights and trends to help you stay ahead of the curve.
							</p>
						</div>
						<div>
							<h2 className="text-3xl font-bold tracking-tighter">Why subscribe?</h2>
							<ul className="mt-4 space-y-2 text-muted-foreground md:text-lg">
								<li className="flex items-start">
									<CheckIcon className="mr-2 h-6 w-6 text-primary" />
									<span>Gain access to exclusive contents</span>
								</li>
								<li className="flex items-start">
									<CheckIcon className="mr-2 h-6 w-6 text-primary" />
									<span>Receive updates on cheat status</span>
								</li>
								<li className="flex items-start">
									<CheckIcon className="mr-2 h-6 w-6 text-primary" />
									<span>Get randomly distributed discount codes</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default NewsletterPage