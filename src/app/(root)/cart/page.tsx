/*
 * This component represents the shopping cart page.
 * It displays the items added to the cart, their details,
 * and provides functionality to remove items and proceed to checkout.
 * It also calculates and displays the order summary including subtotal,
 * transaction fee, and total order amount.
 */

'use client'

import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORY } from "@/config";
import { useCart } from "@/hooks/use-cart"
import { cn, formatPrice } from "@/lib/utils"
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    // Initializing cart state and utilities
    const { items, removeItem } = useCart();

    // Initializing router
    const router = useRouter();

    // Mutation hook for creating checkout session
    const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) router.push(url); // Redirecting to checkout page after successful session creation
        },
    });

    // Extracting product IDs from items in the cart
    const productIds = items.map(({ product }) => product.id);

    // State to track if component is mounted
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // Effect to set isMounted to true when component is mounted
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Calculating cart total by summing up prices of items
    const cartTotal = items.reduce((total, { product }) => total + product.price, 0);

    // Flat transaction fee (currently set to 0)
    const fee = 0;

    // Rendering the UI
    return (
        <div className="bg-white dark:bg-black">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Shopping Cart</h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <div className={cn("lg:col-span-7", {
                        "rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12": isMounted && items.length === 0
                    })}>
                        <h2 className="sr-only">Items in your Shopping Cart</h2>

                        {isMounted && items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-1">
                                <div className="relative mb-4 h-40 w-40 text-muted-foreground" aria-hidden='true'>
                                    {/* TODO: Change Cart Empty Image */}
                                    <Image
                                        src='https://cdn.skailar.com/v1/assets/img/cart.png'
                                        fill
                                        loading="eager"
                                        alt="Skailar Empty Shopping Cart"
                                    />
                                </div>

                                <h3 className="font-semibold text-2xl">Your cart is Empty</h3>
                                <p className="text-muted-foreground text-center">
                                    Oops! Nothing to show here yet.
                                </p>
                            </div>
                        ) : null}

                        <ul className={cn({
                            "divide-y divide-gray-200 dark:divide-gray-800 border-b border-t border-gray-200 dark:border-gray-800": isMounted && items.length > 0,
                        })}>
                            {isMounted && items.map(({ product }) => {
                                const label = PRODUCT_CATEGORY.find((c) => c.value === product.category)?.label;
                                const { image } = product.images[0]

                                return (
                                    <li key={product.id} className="flex py-6 sm:py-10">
                                        <div className="flex-shrink-0">
                                            <div className="relative h-24 w-24">
                                                {typeof image !== "string" && image.url ? (
                                                    <Image fill src={image.url} alt='product image' className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48" />
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm">
                                                            <Link href={`/product/${product.id}`} className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">{product.name}</Link>
                                                        </h3>
                                                    </div>

                                                    <div className="mt-1 flex text-sm">
                                                        <p className="text-muted-foreground">Category: {label}</p>
                                                    </div>

                                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{formatPrice(product.price)}</p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                                                    <div className="absolute right-0 top-0">
                                                        <Button aria-label="remove product" onClick={() => removeItem(product.id)} variant='destructive'>
                                                            <X className="h-5 w-5" aria-hidden='true' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mt-4 flex space-x-2 text-sm text-gray-700 dark:text-gray-300">
                                                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                                <span>Elegible for Instant Delivery</span>
                                            </p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <section className="mt-16 rounded-lg bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Order Summary</h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {isMounted ? formatPrice(cartTotal) : <span>{formatPrice(0)}</span>}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <span>Flat Transaction Fee</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {isMounted ? formatPrice(fee) : formatPrice(0)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                                <div className="text-base font-medium text-gray-900 dark:text-gray-100">Order Total</div>
                                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    {isMounted ? formatPrice(cartTotal + fee) : formatPrice(0)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button className="w-full" size='lg' disabled={isLoading || items.length === 0} onClick={() => createCheckoutSession({ productIds })}>
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                                Checkout
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Page