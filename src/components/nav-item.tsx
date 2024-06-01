"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface NavItemProps {
    href: string;
    text: string;
    target?: string;
}

export const NavItem = ({ href, text, target }: NavItemProps) => {
    return (
        <div className="flex">
            <div className="relative flex items-center">
                <Link href={href} target={target} className={cn('gap-1.5', buttonVariants({ variant: 'ghost' }))}>
                    {text}
                </Link>
            </div>
        </div>
    )
}