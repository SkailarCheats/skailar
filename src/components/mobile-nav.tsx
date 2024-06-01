'use client'

import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export const MobileNav = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const pathname = usePathname()

    useEffect(() => {
        setIsOpen(false);
    }, [])

    const closeOnCurrent = (href: string) => {
        if (pathname === href) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (isOpen)
            document.body.classList.add('overflow-hidden')
        else
            document.body.classList.remove('overflow-hidden')
    }, [isOpen])

    if (!isOpen)
        return (
            <button type="button" onClick={() => setIsOpen(true)} className="lg:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-600">
                <Menu className="h-6 w-6" aria-hidden='true' />
            </button>
        )

    return (
        <div>
            <div className="relative z-40 lg:hidden">
                <div className="fixed inset-0 bg-black dark:bg-white bg-opacity-25" />
            </div>

            <div className="fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex">
                <div className="w-4/5">
                    <div className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white dark:bg-black pb-12 shadow-lg">
                        <div className="flex px-4 pb-2 pt-5">
                            <button type="button" onClick={() => setIsOpen(false)} className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-600">
                                <X className="h-6 w-6" aria-hidden='true' />
                            </button>
                        </div>

                        <div className='mt-2'>
                            <ul>
                                <li
                                    className='space-y-10 px-4 pb-8 pt-10'>
                                    <div className='grid grid-cols-2 gap-y-10 gap-x-4'>
                                        <div
                                            className='group relative text-sm'>
                                            <a
                                                href='/'
                                                className='mt-6 block font-medium text-gray-900 dark:text-gray-100'>
                                                Home
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className='space-y-6 border-t border-gray-200 dark:border-gray-800 px-4 py-6'>
                            <div className='flow-root'>
                                <a
                                    onClick={() => closeOnCurrent('/login')}
                                    href='/login'
                                    className='-m-2 block p-2 font-medium text-gray-900 dark:text-gray-100'>
                                    Login
                                </a>
                            </div>
                            <div className='flow-root'>
                                <a
                                    onClick={() => closeOnCurrent('/register')}
                                    href='/register'
                                    className='-m-2 block p-2 font-medium text-gray-900 dark:text-gray-100'>
                                    Register
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}