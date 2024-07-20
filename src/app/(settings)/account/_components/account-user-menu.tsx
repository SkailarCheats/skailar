import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getServerSideUser } from "@/lib/payload-utils";
import { CircleUserIcon } from "lucide-react"
import { cookies } from "next/headers";
import Link from "next/link";
import { AccountLogoutMenu } from "./account-logout-menu";

export const AccountdUserMenu = async () => {
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
				<DropdownMenuLabel>
					<p className="font-medium text-sm text-black dark:text-white">{user?.username}</p>
					<p className="font-medium text-xs text-muted-foreground">{user?.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{user?.role === 'admin' && (
					<DropdownMenuItem asChild>
						<Link href={`/dashboard`}>Admin Dashboard</Link>
					</DropdownMenuItem>
				)}
				{user?.role === 'reseller' && (
					<DropdownMenuItem asChild>
						<Link href={`/resellers`}>Reseller Dashboard</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem asChild>
					<Link href='https://discord.gg/skailar' target="_blank">
						Support
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<AccountLogoutMenu />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}