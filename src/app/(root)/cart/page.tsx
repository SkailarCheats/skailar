/*
 * This component represents the shopping cart page.
 * It displays the items added to the cart, their details,
 * and provides functionality to remove items and proceed to checkout.
 * It also calculates and displays the order summary including subtotal,
 * transaction fee, and total order amount.
 */

"use client";
import { ClearCartEffect } from "@/components/clear-cart";
import { Button, buttonVariants } from "@/components/ui/button";
import { PRODUCT_CATEGORY } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaClipboard } from "react-icons/fa";
import { toast } from "sonner";

interface PayDataProps {
    network: string;
    pay_address: string;
    address: string;
    pay_amount: number;
}

const Page = () => {
    // Initializing cart state and utilities
    const { items, removeItem } = useCart();

    // Initializing router
    const router = useRouter();

    // Mutation hook for creating checkout session
    // const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
    //     onSuccess: ({ url }) => {
    //         if (url) router.push(url); // Redirecting to checkout page after successful session creation
    //     },
    // });
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payCurrency, setPayCurrency] = useState("");
    const [payData, setPayData] = useState<PayDataProps | null>(null);

    const createCheckoutSession = async () => {
        if (payCurrency === "") return toast.error("Please select currency");
        setIsLoading(true);
        try {
            const price = isMounted ? formatPrice(cartTotal + fee) : formatPrice(0);
            const json = JSON.stringify({ payCurrency, price });
            const res = await fetch("/api/checkout", {
                method: "POST",
                body: json,
            });
            console.log(res);
            const data = await res.json();
            console.log(data);
            if (data.success) {
                toast.success(data.message);
                setPayData(data.payout);
                localStorage.setItem("payout-skailar.com", JSON.stringify(data.payout));
                localStorage.setItem(
                    "expiry-payout-skailar.com",
                    JSON.stringify(Date.now() + 30 * 60 * 1000)
                );
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        setIsLoading(false);
    };
    // Extracting product IDs from items in the cart
    const productIds = items.map(({ product }) => product.id);

    // State to track if component is mounted

    // Effect to set isMounted to true when component is mounted
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Calculating cart total by summing up prices of items
    const cartTotal = items.reduce(
        (total, { product }) => total + product.price,
        0
    );

    // Flat transaction fee (currently set to 0)
    const fee = 0;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        const address = document.querySelector("#address")?.innerHTML;
        navigator.clipboard.writeText(address as string);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    };

    const copyToClipboardAmout = () => {
        const amout = document.querySelector("#amout")?.innerHTML;
        navigator.clipboard.writeText(amout as string);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
    }

    const handleOrder = async ({ productIds }: any) => {
        setLoading(true);
        console.log(productIds);
        const storedData = JSON.parse(localStorage.getItem("payout-skailar.com")!);
        const time = parseInt(localStorage.getItem("expiry-payout-skailar.com")!);
        if (time - Date.now() <= 0)
            return toast.error("Address expired please regenerate");
        const res = await fetch("/api/payment/status", {
            method: "POST",
            body: JSON.stringify({ id: storedData.payment_id, productIds }),
        });
        const data = await res.json();
        if (data.success) {
            toast.success(data.message);
            localStorage.removeItem("payout-skailar.com");
            localStorage.removeItem("expiry-payout-skailar.com");
            ClearCartEffect(data.newOrder._isPaid);
            router.push(`/thank-you?orderId=${data.newOrder.id}`);
        } else {
            toast.error(data.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!payData) {
            if (localStorage.getItem("payout-skailar.com")) {
                const time = parseInt(
                    localStorage.getItem("expiry-payout-skailar.com")!
                );
                if (time - Date.now() <= 0) {
                    localStorage.removeItem("payout-skailar.com");
                    localStorage.removeItem("expiry-payout-skailar.com");
                } else {
                    setPayData(JSON.parse(localStorage.getItem("payout-skailar.com")!));
                    setOpen(true);
                }
            }
        }
    }, [payData]);
    // Rendering the UI
    return (
        <div className="bg-white dark:bg-black">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                    Shopping Cart
                </h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <div
                        className={cn("lg:col-span-7", {
                            "rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12":
                                isMounted && items.length === 0,
                        })}
                    >
                        <h2 className="sr-only">Items in your Shopping Cart</h2>

                        {isMounted && items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-1">
                                <div
                                    className="relative mb-4 h-40 w-40 text-muted-foreground"
                                    aria-hidden="true"
                                >
                                    {/* TODO: Change Cart Empty Image */}
                                    <Image
                                        src="https://cdn.skailar.com/v1/assets/img/cart.png"
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

                        <ul
                            className={cn({
                                "divide-y divide-gray-200 dark:divide-gray-800 border-b border-t border-gray-200 dark:border-gray-800":
                                    isMounted && items.length > 0,
                            })}
                        >
                            {isMounted &&
                                items.map(({ product }) => {
                                    const label = PRODUCT_CATEGORY.find(
                                        (c) => c.value === product.category
                                    )?.label;
                                    const { image } = product.images[0];

                                    return (
                                        <li key={product.id} className="flex py-6 sm:py-10">
                                            <div className="flex-shrink-0">
                                                <div className="relative h-24 w-24">
                                                    {typeof image !== "string" && image.url ? (
                                                        <Image
                                                            fill
                                                            src={image.url}
                                                            alt="product image"
                                                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                                                        />
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <h3 className="text-sm">
                                                                <Link
                                                                    href={`/product/${product.id}`}
                                                                    className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
                                                                >
                                                                    {product.name}
                                                                </Link>
                                                            </h3>
                                                        </div>

                                                        <div className="mt-1 flex text-sm">
                                                            <p className="text-muted-foreground">
                                                                Category: {label}
                                                            </p>
                                                        </div>

                                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {formatPrice(product.price)}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                                                        <div className="absolute right-0 top-0">
                                                            <Button
                                                                aria-label="remove product"
                                                                onClick={() => removeItem(product.id)}
                                                                variant="destructive"
                                                            >
                                                                <X className="h-5 w-5" aria-hidden="true" />
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
                                    );
                                })}
                        </ul>
                    </div>

                    <section className="mt-16 rounded-lg bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Subtotal
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {isMounted ? (
                                        formatPrice(cartTotal)
                                    ) : (
                                        <span>{formatPrice(0)}</span>
                                    )}
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
                                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    Order Total
                                </div>
                                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    {isMounted ? formatPrice(cartTotal + fee) : formatPrice(0)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                className="w-full"
                                size="lg"
                                disabled={items.length === 0}
                                onClick={() => setOpen(true)}
                            >
                                Checkout
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/40 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="bg-white dark:bg-[#101010] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="w-full">
                                    <div className="mt-3 sm:ml-4 sm:mt-0">
                                        <DialogTitle
                                            as="h3"
                                            className="text-2xl text-center font-bold mb-4 leading-6 text-gray-900 dark:text-white"
                                        >
                                            Pay{" "}
                                            {isMounted
                                                ? formatPrice(cartTotal + fee)
                                                : formatPrice(0)}{" "}
                                            to continue
                                        </DialogTitle>
                                        <h4 className="text-base">Pay With</h4>
                                        <div className="mt-2 text-center flex gap-4">
                                            <button
                                                onClick={() => setPayCurrency("BNBBSC")}
                                                className={`${payCurrency === "BNBBSC"
                                                    ? "dark:bg-background bg-black/10"
                                                    : "dark:bg-[#202020] "
                                                    } items-center gap-2 w-1/2 flex h-10 rounded-md border border-input hover:bg-black/20 dark:hover:bg-[#171717] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/bnb.svg" alt="" className="w-4 h-4" />
                                                BNB (BSC)
                                            </button>
                                            <button
                                                onClick={() => setPayCurrency("TRX")}
                                                className={`${payCurrency === "TRX"
                                                    ? "dark:bg-background bg-black/10"
                                                    : "dark:bg-[#202020] "
                                                    } items-center gap-2 w-1/2 flex h-10 rounded-md border border-input hover:bg-black/20 dark:hover:bg-[#171717] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                                            >
                                                {" "}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/trx.svg" alt="" className="w-4 h-4" />
                                                TRX
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {payData && !isLoading ? (
                                <div className="w-full ">
                                    <div className="bg-white dark:bg-[#101010] flex flex-col items-center justify-center py-12 text-white font-sans">
                                        <h1 className="mb-5 text-2xl text-black dark:text-white">
                                            Deposit Address Network {payData.network.toUpperCase()}
                                        </h1>
                                        <div className="flex bg-black/10 items-center dark:bg-[#202020] text-gray-800 dark:text-white rounded-lg">
                                            <p id="address" className="font-mono p-2">
                                                {payData.pay_address}
                                            </p>
                                            <button
                                                id="copy-btn"
                                                onClick={copyToClipboard}
                                                className="bg-black/30 hover:bg-black/20 dark:hover:bg-black/70 dark:bg-black/60 text-white font-bold py-2 px-2 rounded flex items-center"
                                            >
                                                <span id="copy-text" className="">
                                                    {copied ? (
                                                        <FaCheck className="text-green-500 text-md" />
                                                    ) : (
                                                        <FaClipboard className="text-md" />
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                        <p className="mt-2 text-md flex gap-1 items-center">
                                            amount to pay in {payData.network.toUpperCase()}
                                            <div className="flex bg-black/10 items-center dark:bg-[#202020] text-gray-800 dark:text-white rounded-lg">
                                                <span id="amout" className="font-mono p-2">{payData.pay_amount}</span>
                                                <button
                                                    id="copy-btn"
                                                    onClick={copyToClipboardAmout}
                                                    className="bg-black/30 hover:bg-black/20 dark:hover:bg-black/70 dark:bg-black/60 text-white font-bold py-2 px-2 rounded flex items-center"
                                                >
                                                    <span id="copy-text" className="">
                                                        {copied ? (
                                                            <FaCheck className="text-green-500 text-md" />
                                                        ) : (
                                                            <FaClipboard className="text-md" />
                                                        )}
                                                    </span>
                                                </button>
                                            </div>
                                        </p>
                                        <p className="mt-2 text-xs flex gap-1 items-center">
                                            Pay withing 30 minutes address will expire or {" "}
                                            <button
                                                onClick={createCheckoutSession}
                                                className=" text-white font-bold py-2 rounded flex items-center"
                                            >
                                                Regenerate
                                            </button>
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-[#101010] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <Button
                                            disabled={
                                                loading || items.length === 0 || payData.address === ""
                                            }
                                            onClick={() => handleOrder({ productIds })}
                                        >
                                            {loading && (
                                                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                            )}
                                            Paid
                                        </Button>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => {
                                                localStorage.removeItem("payout-skailar.com");
                                                setPayData(null);
                                                setOpen(false);
                                            }}
                                            className={buttonVariants({ variant: 'ghost' })}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className=" bg-white dark:bg-[#101010] text-center px-4 py-3">
                                    <Button
                                        className="w-1/2 mx-auto"
                                        size="lg"
                                        disabled={
                                            isLoading || items.length === 0 || payCurrency === ""
                                        }
                                        onClick={() => createCheckoutSession()}
                                    >
                                        {isLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                        )}
                                        Generate Address
                                    </Button>
                                </div>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Page;
