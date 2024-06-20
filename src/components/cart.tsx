"use client"

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem } from "./cart-item";
import { buttonVariants } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export const Cart = () => {
    const { items } = useCart()
    const itemCount = items.length;

    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const cartTotal = items.reduce((total, { product }) => total + product.price, 0)

    const fee = 0;

    return (
        <Sheet>
            <SheetTrigger className="group -m-2 flex items-center p-2">
                <ShoppingBag aria-hidden='true' className="h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-600 group-hover:text-gray-500" />
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                    {isMounted ? itemCount : 0}
                </span>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle>Cart ({itemCount})</SheetTitle>
                </SheetHeader>
                {itemCount > 0 ? (
                    <>
                        <div className="flex w-full flex-col pr-6">
                            <ScrollArea>
                                {items.map(({ product }) => (
                                    <CartItem product={product} key={product.id} />
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4 pr-6">
                            <Separator />
                            <div className="space-y-1.5 text-sm">
                                <div className="flex">
                                    <span className="flex-1">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Transaction Fee</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    <span>{formatPrice(cartTotal + fee)}</span>
                                </div>
                            </div>

                            <SheetFooter>
                                <SheetTrigger asChild>
                                    <Link href='/cart' className={buttonVariants({ className: 'w-full' })}>Continue to Checkout</Link>
                                </SheetTrigger>
                            </SheetFooter>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-1">
                        <div aria-hidden='true' className="relative mb-4 h-60 w-60 text-muted-foreground">
                            {/* TODO: Change Cart Empty Image */}
                            <Image src='https://cdn.skailar.com/v1/assets/img/cart.png' fill alt="Empty Shopping Cart" />
                        </div>
                        <div className="text-xl font-semibold">Your cart is Empty</div>
                        <SheetTrigger asChild>
                            <Link href='/products' className={buttonVariants({ variant: 'link', size: 'sm', className: 'text-sm text-muted-foreground' })}>Add Products to your Cart to Checkout</Link>
                        </SheetTrigger>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}