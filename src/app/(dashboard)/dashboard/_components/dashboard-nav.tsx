'use client';

import { ModeToggle } from "@/components/toggle";
import { cn } from "@/lib/utils";
import { DollarSign, HomeIcon, Key, PackageIcon, Shield, ShoppingCartIcon, Star, UsersIcon, Ban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckLicense } from "./check-license";
import { Banrequest } from "@/payload-types";
import { Badge } from "@/components/ui/badge";

export const links = [
	{ title: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
	{ title: 'Orders', icon: ShoppingCartIcon, href: '/dashboard/orders' },
	{ title: 'Products', icon: PackageIcon, href: '/dashboard/products' },
	{ title: 'Customers', icon: UsersIcon, href: '/dashboard/customers' },
	{ title: 'Resellers', icon: DollarSign, href: '/dashboard/resellers' },
	{ title: 'Admins', icon: Shield, href: '/dashboard/admins' },
	{ title: 'Reviews', icon: Star, href: '/dashboard/reviews' },
	{ title: 'Ban Requests', icon: Ban, href: '/dashboard/ban-requests' },
	{ title: 'Licenses', icon: Key, href: '/dashboard/licenses' },
];

export const DashboardNav = ({ banRequests }: { banRequests: Banrequest[] }) => {
	const currentRoute = usePathname();
	const active = 'bg-muted text-primary hover:text-primary';

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
							{link.title === 'Ban Requests' && banRequests.length > 0 && (
								<Badge className="-ml-1.5 px-1.5">
									{banRequests.length}
								</Badge>
							)}
						</Link>
					))}
				</nav>
			</div>
			<div className="mt-auto p-4">
				<CheckLicense />
			</div>
		</div>
	);
};
