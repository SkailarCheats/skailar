'use client'

import { User } from "@/payload-types";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const MobileNav = ({ user }: { user: User | null }) => {
    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Products', href: '/products' },
        { title: 'Reviews', href: '/reviews' },
        { title: 'Status', href: 'https://status.skailar.com/status/cheats', target: '_blank' },
        { title: 'Discord', href: 'https://discord.gg/skailar', target: '_blank' }
    ]

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
                            <Image src='/logo.png' width='24' height='24' alt="Skailar Logo" />
                            <span>Skailar</span>
                        </Link>

                        {navLinks.map((link, index) => (
                            <Link
                                href={link.href ? link.href : ''}
                                key={index}
                                className={buttonVariants({ variant: 'ghost' })}
                                target={link.target}
                            >
                                {link.title}
                            </Link>
                        ))}

                        <div className="mt-2"></div>
                        {!user && (
                            <Link
                                href='/login'
                                className={buttonVariants({ variant: 'ghost' })}
                            >
                                Login
                            </Link>
                        )}
                        {user && (
                            <Link
                                href={`/account/${user.username}`}
                                className={buttonVariants({ variant: 'ghost' })}
                            >
                                Settings
                            </Link>
                        )}

                        {user && user.role === 'admin' && (
                            <Link
                                href={`/dashboard`}
                                className={buttonVariants({ variant: 'ghost' })}
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
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    )
}