"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export const LogoutUserMenu = () => {
	const { signOut } = useAuth()

	return (
		<DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
	)
}