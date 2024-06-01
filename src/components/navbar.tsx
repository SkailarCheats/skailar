import Link from "next/link"
import { MaxWidthWrapper } from "./MaxWidthWrapper"
import Image from "next/image"
import { NavItems } from "./nav-items"
import { buttonVariants } from "./ui/button"
import { Cart } from "./cart"
import { getServerSideUser } from "@/lib/payload-utils"
import { cookies } from 'next/headers'
import { UserAccountNav } from "./user-account-nav"
import { MobileNav } from "./mobile-nav"
import { ModeToggle } from "./toggle"

export const Navbar = async () => {
    const nextCookies = cookies();
    const { user } = await getServerSideUser(nextCookies)

    return (
        <div className="bg-white dark:bg-black sticky z-50 top-0 inset-x-0 h-16">
            <header className="relative bg-white dark:bg-black">
                <MaxWidthWrapper>
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <div className="flex h-16 items-center">
                            <MobileNav />

                            <div className="ml-4 flex lg:ml-0">
                                <Link href='/'>
                                    <Image src='/logo.png' width='40' height='40' alt="Skailar Logo" />
                                </Link>
                            </div>

                            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                                <NavItems />
                            </div>

                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {user ? null : <Link href='/login' className={buttonVariants()}>Login</Link>}
                                    {user ? <UserAccountNav user={user} /> : <Link href='/register' className={buttonVariants({ variant: "outline" })}>Register</Link>}
                                    {!user ? null : (
                                        <div className="flex lg:ml-6">
                                            <span className="h-6 w-px bg-gray-200 dark:bg-gray-800" aria-hidden='true' />

                                            <div className="ml-4 flow-root lg:ml-6">
                                                <Cart />
                                            </div>
                                        </div>
                                    )}

                                    <span className="h-6 w-px bg-gray-200 dark:bg-gray-800" aria-hidden='true' />
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    )
}