"use client";

import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ChevronRight } from "lucide-react";
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
				Introducing Skailar
			</span>
			<ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
		</AnimatedGradientText>
		<h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
			Skailar offers affordable
			<br className="hidden md:block" /> top-tier cheating services.
		</h1>
		<p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
			delivers high-quality, affordable cheating services by leveraging its extensive
			<br className="hidden md:block" /> user base for exceptional value.
		</p>
		<Link href='#start' className={buttonVariants({ variant: 'white', className: 'translate-y-[-1rem] animate-fade-in gap-1 rounded-lg text-white dark:text-black opacity-0 ease-in-out [--animation-delay:600ms]' })}>
			<span>Get Started</span>
			<ArrowDownIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
		</Link>
	</section>
); 
