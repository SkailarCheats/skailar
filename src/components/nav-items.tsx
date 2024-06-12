"use client";

import { useEffect, useState } from "react";
import { NavItem } from "./nav-item";

export const NavItems = () => {
    const [activeIndex, setActiveIndex] = useState<null | number>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setActiveIndex(null);
            }
        }

        document.addEventListener("keydown", handler)

        return () => {
            document.removeEventListener("keydown", handler);
        }
    }, []);


    return (
        <div className="flex gap-4 h-full">
            <NavItem text="Home" href="/" />
            <NavItem text="Products" href="/products" />
            <NavItem text="Reviews" href="/reviews" />
            <NavItem text="Status" target="_blank" href="https://status.skailar.com/status/cheats" />
            <NavItem text="Discord" target="_blank" href="https://discord.gg/skailar" />
        </div>
    )
}