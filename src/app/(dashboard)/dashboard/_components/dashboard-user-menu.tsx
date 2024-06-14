import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getServerSideUser } from "@/lib/payload-utils";
import { CircleUserIcon } from "lucide-react"
import { cookies } from "next/headers";
import Link from "next/link";

export const DashboardUserMenu = async () => {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary" size="icon" className="rounded-full">
					<CircleUserIcon className="h-5 w-5" />
					<span className="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{user?.email ? user?.email : '[N/A]'}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					{user?.role === 'admin' && <Link href='/sell'>Seller Dashboard</Link>}
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href='https://discord.gg/skailar' target="_blank">
						Support
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}