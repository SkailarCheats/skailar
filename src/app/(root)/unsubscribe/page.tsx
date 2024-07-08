"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageProps {
	searchParams: {
		email: string;
	}
}

export default function UnsubscribePage({ searchParams }: PageProps) {
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter()

	const { email } = searchParams

	useEffect(() => {
		const unsubscribe = async () => {
			if (!email) return;

			try {
				const response = await fetch(`/api/newsletter/unsubscribe`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				});
				if (response.ok) {
					console.log("Unsubscribed successfully");
				} else {
					console.error("Failed to unsubscribe");
				}
			} catch (error) {
				console.error("Error while unsubscribing", error);
			}
		};

		unsubscribe();
	}, [email]);

	if (!email) return notFound();

	function isValidEmail(email: string) {
		return /\S+@\S+\.\S+/.test(email);
	}

	const handleResubscribe = async () => {
		if (!isValidEmail(email)) {
			toast.error('Email not valid');
			return
		}

		try {
			setLoading(true)
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				toast.success("Welcome Back!")
			}

			setTimeout(() => {
				router.push('/')
			}, 2000)
		} catch (error) {
			toast.error("Error")
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/50 to-white">
							You&apos;ve been successfully unsubscribed.
						</h1>
						<p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
							Thank you for your time with us. We hope to see you again soon.
						</p>
					</div>
					<div className="w-full max-w-sm space-y-2">
						<Button onClick={() => handleResubscribe()} disabled={loading} className={buttonVariants()}>
							{loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Resubscribe</> : 'Resubscribe'}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
