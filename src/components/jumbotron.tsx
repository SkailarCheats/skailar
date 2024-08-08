"use client";

import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export const Jumbotron = () => (
	<section
		id="hero"
		className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
	>
		<AnimatedGradientText>
			🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
			<span
				className={cn(
					`inline animate-gradient bg-gradient-to-r from-[#9c40ff] to-[#D8BFD8] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
				)}
			>
				Skailar is coming
			</span>
			<ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
		</AnimatedGradientText>
		<h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
			Your one-stop shop for
			<br className="hidden md:block" /> premium{' '}
			<span className="text-purple-600">cheats</span>.
		</h1>
		<p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
			Welcome to Skailar. Our team rigorously tests each cheat to guarantee
			<br className="hidden md:block" />top-notch quality and reliability.
		</p>
		<Link href='/products' className={buttonVariants({ variant: 'white', className: 'translate-y-[-1rem] animate-fade-in gap-1 rounded-lg text-white dark:text-black opacity-0 ease-in-out [--animation-delay:600ms]' })}>
			<span>Explore Popular Cheats</span>
			<ArrowDownIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
		</Link>
	</section>
); 
