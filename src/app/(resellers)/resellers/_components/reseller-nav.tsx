'use client';

import { ModeToggle } from "@/components/toggle";
import { cn } from "@/lib/utils";
import { HomeIcon, Key, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckLicenseForm } from "./check-license-form";
// import { CheckLicense } from "./check-license";

export const links = [
	{ title: 'Dashboard', icon: HomeIcon, href: '/resellers' },
	{ title: 'Buy Balance', icon: ShoppingCartIcon, href: '/resellers/shop' },
	{ title: 'New License', icon: Key, href: '/resellers/generate' },
	{ title: 'Licenses', icon: Key, href: '/resellers/licenses' }
]

export const ResellerNav = ({ currentReseller }: { currentReseller: string }) => {
	const currentRoute = usePathname();
	const active = 'bg-muted text-primary hover:text-primary'

	return (
		<div className="flex h-full max-h-screen flex-col gap-2">
			<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
					<Image src='https://cdn.skailar.com/v1/assets/img/logo.png' width='24' height='24' alt="Skailar Logo" />
					<span className="">Skailar</span>
				</Link>

				{/* <div className="ml-auto">
					<ModeToggle />
				</div> */}
			</div>

			<div className="flex-1">
				<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
					{links.map((link, index) => (
						<Link
							href={link.href}
							key={index}
							className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", currentRoute === link.href ? active : 'text-muted-foreground')}
						>
							{<link.icon className="h-4 w-4" />}
							{link.title}
						</Link>
					))}
				</nav>
			</div>
			<div className="mt-auto p-4">
				<CheckLicenseForm currentReseller={currentReseller} />
			</div>
		</div>
	)
}