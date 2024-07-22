'use client'

import { User } from "@/payload-types";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from "@/hooks/use-auth";

export const MobileNav = ({ user }: { user: User | null }) => {
    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Products', href: '/products' },
        { title: 'Reviews', href: '/reviews' },
        { title: 'Status', href: 'https://status.skailar.com/', target: '_blank' },
        { title: 'Discord', href: 'https://discord.gg/skailar', target: '_blank' }
    ]

    const { signOut } = useAuth()

    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <MenuIcon className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold cursor-pointer">
                            <Image src='https://cdn.skailar.com/v1/assets/img/logo.png' width='24' height='24' alt="Skailar Logo" />
                            <span>Skailar</span>
                        </Link>

                        {navLinks.map((link, index) => (
                            <Link
                                href={link.href ? link.href : ''}
                                key={index}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                                target={link.target}
                            >
                                {link.title}
                            </Link>
                        ))}

                        <div className="mt-2"></div>
                        {!user && (
                            <Link
                                href='/login'
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                                Login
                            </Link>
                        )}
                        {!user && (
                            <Link
                                href='/register'
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                                Register
                            </Link>
                        )}
                        {user && (
                            <Link
                                href={`/account/${user.username}`}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                                Settings
                            </Link>
                        )}

                        {user && user.role === 'admin' && (
                            <Link
                                href={`/dashboard`}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                                Admin Dashboard
                            </Link>
                        )}

                        {user && user.role === 'reseller' && (
                            <Link
                                href={`/resellers`}
                                className={buttonVariants({ variant: 'ghost' })}
                            >
                                Reseller Dashboard
                            </Link>
                        )}

                        <div className="mt-2"></div>

                        {user && (
                            <Button
                                onClick={signOut}
                            >
                                Logout
                            </Button>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    )
}