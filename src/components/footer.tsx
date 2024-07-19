'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaxWidthWrapper } from "./MaxWidthWrapper";

const navigation = {
    connect: [
        {
            name: 'Discord',
            href: 'https://discord.skailar.com/cheats',
        },
        {
            name: 'YouTube',
            href: 'https://www.youtube.com/@steveyx17baby',
        },
        {
            name: 'Telegram',
            href: 'https://t.me/skailarcheats',
        },
    ],
    company: [
        { name: 'Status Page', href: 'https://status.skailar.com/' },
        { name: 'Blogs', href: 'https://blog.skailar.com/' },
        { name: 'Mail', href: 'https://mail.skailar.com/' },
    ],
    support: [
        { name: 'Help Center', href: 'https://help.skailar.com/' },
    ]
}

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
                <div className="m-10 mx-auto max-w-7xl px-2">
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

                        <div className="mt-16 grid grid-cols-3 gap-14 md:grid-cols-3 lg:mt-0 xl:col-span-3">
                            <div className="md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-gray-900  dark:text-gray-200">
                                    Connect
                                </h3>
                                <div className="mt-6 space-y-4">
                                    {navigation.connect.map((item) => (
                                        <div key={item.name}>
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm leading-6 text-gray-700 hover:text-gray-900 dark:text-gray-600 hover:dark:text-gray-200"
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
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm leading-6 text-gray-700 hover:text-gray-900 dark:text-gray-600 hover:dark:text-gray-200"
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
                                        Support &amp; Legal
                                    </h3>
                                    <div className="mt-6 space-y-4">
                                        {navigation.support.map((item) => (
                                            <div key={item.name}>
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm leading-6 text-gray-700 hover:text-gray-900 dark:text-gray-600 hover:dark:text-gray-200"
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
                        <p className="text-xs leading-5 text-gray-700 dark:text-gray-300">
                            &copy;{year} Skailar. All rights reserved.
                        </p>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    )
}