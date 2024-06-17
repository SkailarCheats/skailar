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
				<DropdownMenuLabel>{user?.username ? user?.username : '[N/A]'}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={`/account/${user?.username}`}>Settings</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={`/dashboard`}>Admin Dashboard</Link>
				</DropdownMenuItem>
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