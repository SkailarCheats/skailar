'use client';

import { ModeToggle } from "@/components/toggle";
import { cn } from "@/lib/utils";
import { User } from "@/payload-types";
import { CreditCardIcon, DollarSign, HomeIcon, Key, LockIcon, PackageIcon, SettingsIcon, ShoppingCartIcon, Star, UserIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AccountNav = ({ user }: { user: User }) => {
	const currentRoute = usePathname();
	const active = 'bg-muted text-primary hover:text-primary'

	const menu = [
		{ label: 'Personal Info', icon: UserIcon, href: `/account/${user?.username}`, disabled: false },
		{ label: 'Security', icon: LockIcon, href: `/account/${user?.username}/security`, disabled: false },
		{ label: 'Orders', icon: CreditCardIcon, href: `/account/${user?.username}/orders`, disabled: false },
		{ label: 'Settings', icon: SettingsIcon, href: `/account/${user?.username}/settings`, disabled: false },
	]

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
					{menu.map((link, index) => (
						<Link
							href={link.href}
							key={index}
							className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", currentRoute === link.href ? active : 'text-muted-foreground')}
						>
							{<link.icon className="h-4 w-4" />}
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</div>
	)
}