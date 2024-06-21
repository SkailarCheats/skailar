'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaxWidthWrapper } from "./MaxWidthWrapper";

export const Footer = () => {
    const pathname = usePathname()
    const pathsToMinimize = [
        '/verify-email',
        '/login',
        '/register',
        '/thank-you'
    ]

    return (
        <footer className="bg-white dark:bg-black flex-grow-0">
            <MaxWidthWrapper>
                <div className="border-t border-gray-200 dark:border-gray-800">
                    {pathsToMinimize.includes(pathname) ? null : (
                        <div className="pb-8 pt-16">
                            <div className="flex justify-center">
                                <Image src='https://cdn.skailar.com/v1/assets/img/logo.png' height='48' width='48' className="h-12 w-auto" alt="Skailar" />
                            </div>
                        </div>
                    )}

                    {pathsToMinimize.includes(pathname) ? null : (
                        <div>
                            <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                                <div className="absolute inset-0 overflow-hidden rounded-lg">
                                    <div aria-hidden='true' className="absolute bg-zinc-50 dark:bg-zinc-950 inset-0 bg-gradient-to-br bg-opacity-90" />
                                </div>

                                <div className="text-center relative mx-auto max-w-sm">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Become a Reseller</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        If you&apos;d like to sell high-quality
                                        cheats, you can do so in minutes.{' '}
                                        <Link href='/register?as=reseller' className="whitespace-nowrap font-medium text-black dark:text-white hover:text-zinc-900 dark:hover:text-zinc-100">
                                            Get started &rarr;
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="py-10 md:flex md:items-center md:justify-between">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">
                            &copy;{new Date().getFullYear()} All Rights Reserved.
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-center md:mt-0">
                        <div className="flex space-x-8">
                            <Link href='/legal/terms' className="text-sm text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">Terms</Link>
                            <Link href='https://status.skailar.com/' className="text-sm text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">Status</Link>
                            <Link href='https://help.skailar.com' target="_blank" className="text-sm text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">Help Center</Link>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    )
}