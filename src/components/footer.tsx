'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { navigation } from "@/config";

export const Footer = () => {
    const pathname = usePathname()
    const pathsToMinimize = [
        '/verify-email',
        '/login',
        '/register',
        '/thank-you'
    ]

    const year = new Date().getFullYear().toString()

    return (
        <footer
            className="bg-white dark:bg-black flex-grow-0"
        >
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

                <div className="m-10 mt-16 mx-auto max-w-7xl px-2">
                    <div className="flex flex-col justify-between lg:flex-row">
                        <div className="space-y-8">
                            <Image
                                priority={true}
                                unoptimized={true}
                                width={100}
                                height={40}
                                src="https://cdn.skailar.com/v1/assets/img/logo.png"
                                alt="logo"
                                className="h-14 w-auto"
                            />
                            <p className="text-md max-w-xs leading-6 text-gray-700 dark:text-gray-300">
                                Enhance your gaming experience with our top-tier, secure, and reliable cheats.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-2 gap-14 md:grid-cols-2 lg:grid-cols-4 lg:mt-0 xl:col-span-3">
                            <div className="md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                                    Connect
                                </h3>
                                <div className="mt-6 space-y-4">
                                    {navigation.connect.map((item) => (
                                        <div key={item.name}>
                                            <a
                                                href={item.href}
                                                target={`${item.href.startsWith('https') ? '_blank' : '_parent'}`}
                                                rel="noreferrer"
                                                className="text-sm leading-6 text-muted-foreground"
                                            >
                                                {item.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                                        Skailar
                                    </h3>
                                    <div className="mt-6 space-y-4">
                                        {navigation.company.map((item) => (
                                            <div key={item.name}>
                                                <a
                                                    href={item.href}
                                                    target={`${item.href.startsWith('https') ? '_blank' : '_parent'}`}
                                                    rel="noreferrer"
                                                    className="text-sm leading-6 text-muted-foreground"
                                                >
                                                    {item.name}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                                        Legals
                                    </h3>
                                    <div className="mt-6 space-y-4">
                                        {navigation.legals.map((item) => (
                                            <div key={item.name}>
                                                <a
                                                    href={item.href}
                                                    target={`${item.href.startsWith('https') ? '_blank' : '_parent'}`}
                                                    rel="noreferrer"
                                                    className="text-sm leading-6 text-muted-foreground"
                                                >
                                                    {item.name}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                                        Others
                                    </h3>
                                    <div className="mt-6 space-y-4">
                                        {navigation.support.map((item) => (
                                            <div key={item.name}>
                                                <a
                                                    href={item.href}
                                                    target={`${item.href.startsWith('https') ? '_blank' : '_parent'}`}
                                                    rel="noreferrer"
                                                    className="text-sm leading-6 text-muted-foreground"
                                                >
                                                    {item.name}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-gray-100/10">
                        <div className="md:flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                &copy;{year} Skailar. All Rights Reserved.
                            </p>
                            <iframe
                                src="https://status.skailar.com/embed-status/ab98f0b9/dark-sm"
                                width="230"
                                height="40"
                                frameBorder="0"
                                scrolling="no"
                                style={{ border: "none" }}
                                className="w-[230px] rounded-full"
                            >
                            </iframe>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    )
}
