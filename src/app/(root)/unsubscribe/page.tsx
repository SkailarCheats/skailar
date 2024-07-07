"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";

interface PageProps {
	searchParams: {
		email: string;
	}
}

export default function UnsubscribePage({ searchParams }: PageProps) {
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

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
							You&apos;ve been successfully unsubscribed.
						</h1>
						<p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
							Thank you for your time with us. We hope to see you again soon.
						</p>
					</div>
					<div className="w-full max-w-sm space-y-2">
						<Link className={buttonVariants()} href="/" prefetch={false}>
							Return to Home
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
