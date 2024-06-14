"use client";

import { useAuth } from "@/hooks/use-auth";
import { User } from "@/payload-types";
import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const UserAccountNav = ({ user }: { user: User }) => {
    const { signOut } = useAuth()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="overflow-visible">
                <Button variant='outline' size='sm' className="relative">My Account</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white dark:bg-black w-60" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-medium text-sm text-black dark:text-white">{user.username}</p>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    {user.role === 'admin' && (user.email === 'amtriix@skailar.com' || user.email === 'edoardo.bergamo03@gmail.com') ? (
                        <Link href='/sell'>Seller Dashboard</Link>
                    ) : (
                        <Link href='/' className="cursor-not-allowed">Reseller Dashboard</Link>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    {user.role === 'admin' && (
                        <Link href='/dashboard'>Admin Dashboard</Link>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href='/loader'>Download Loader</Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}