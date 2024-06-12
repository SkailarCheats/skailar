'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "./dashboard-nav";

export const DashboardMenuNav = () => {
	const currentRoute = usePathname();
	const active = 'bg-muted text-primary hover:text-primary'

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="shrink-0 md:hidden">
					<MenuIcon className="h-5 w-5" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col">
				<nav className="grid gap-2 text-lg font-medium">
					<Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
						<Image src='/logo.png' width='24' height='24' alt="Skailar Logo" />
						<span className="">Skailar</span>
					</Link>

					{links.map(link => (
						<Link
							href={link.href}
							className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", currentRoute === link.href ? active : 'text-muted-foreground')}
						>
							{<link.icon className="h-4 w-4" />}
							{link.title}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	)
}