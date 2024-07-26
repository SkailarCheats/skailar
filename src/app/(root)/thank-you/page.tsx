import { ClearCartEffect } from "@/components/clear-cart"
import { PaymentStatus } from "@/components/payment-status"
import { PRODUCT_CATEGORY } from "@/config"
import { getPayloadClient } from "@/get-payload"
import { getServerSideUser } from "@/lib/payload-utils"
import { formatPrice } from "@/lib/utils"
import { Product, ProductFile, User } from "@/payload-types"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Page = async ({ searchParams }: PageProps) => {
    const orderId = searchParams.orderId

    const nextCookies = cookies()
    const { user } = await getServerSideUser(nextCookies)

    const payload = await getPayloadClient()
    const { docs: orders } = await payload.find({
        collection: "orders",
        depth: 2,
        where: {
            id: {
                equals: orderId
            }
        }
    })

    const [order] = orders;

    if (!order) return notFound();

    const orderUserId = typeof order.user === "string" ? order.user : order.user.id

    if (orderUserId !== user?.id) {
        return redirect(`/login?origin=thank-you?orderId=${order.id}`)
    }

    const products = order.products as Product[]

    const orderTotal = products.reduce((total, product) => {
        return total + product.price
    }, 0)

    return (
        <main className="relative lg:min-h-full">
            <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
                {/* TODO: Change Image */}
                <Image
                    fill
                    src='https://cdn.skailar.com/v1/assets/img/checkout-thank-you.jpg'
                    className="h-full w-full object-cover object-center"
                    alt="Thank you for your Order"
                />
            </div>

            <div>
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
                    <div className="lg:col-start-2">
                        <p className="text-sm font-medium text-purple-600">Order Successful</p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">Thanks for ordering</h1>
                        {order._isPaid ? (
                            <p className="mt-2 text-base text-muted-foreground">
                                Your Order was Processed and your Loader is available to download below.
                                We&apos;ve sent your receipt and order details to {typeof order.user !== "string" ? (
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{order.user.email}</span>
                                ) : null}
                                .</p>
                        ) : (
                            <p className="mt-2 text-base text-muted-foreground">
                                We appreciate your order, and we&apos;re currently processing it.
                                So hang tight and we&apos;ll send you confirmation very soon!
                            </p>
                        )}

                        <div className="mt-16 text-sm font-medium">
                            <div className="text-muted-foreground">Order Nr.</div>
                            <div className="mt-2 text-gray-900 dark:text-gray-100">{order.id}</div>

                            <ul className="mt-6 divide-y divide-gray-200 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800 text-sm font-medium text-muted-foreground">
                                {(order.products as Product[]).map(product => {
                                    const label = PRODUCT_CATEGORY.find((c) => c.value === product.category)?.label;
                                    const downloadUrl = (product.product_files as ProductFile).url as string;
                                    const { image } = product.images[0]

                                    return (
                                        <li key={product.id} className="flex space-x-6 py-6">
                                            <div className="relative h-24 w-24">
                                                {typeof image !== "string" && image && (
                                                    <Image fill src={image} alt={`${product.name} image`} className="flex-none rounded-md bg-gray-100 dark:bg-gray-900 object-cover object-center" />
                                                )}
                                            </div>

                                            <div className="flex-auto flex flex-col justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="text-gray-900 dark:text-gray-100">{product.name}</h3>
                                                    <p className="my-1">Category: {label}</p>
                                                </div>

                                                {order._isPaid && (
                                                    <>
                                                        <div className="flex">
                                                            <p className="mt-3">License Key:</p>
                                                            <p className="mt-3 ml-2 text-white">{order.licenseKey}</p>
                                                        </div>

                                                        <Link href="/loader" download={product.name} className="text-purple-600 hover:underline underline-offset-2">
                                                            Download Loader
                                                        </Link>
                                                    </>
                                                )}
                                            </div>

                                            <p className="flex-none font-medium text-gray-900 dark:text-gray-100">
                                                {formatPrice(product.price)}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="space-y-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-sm font-medium text-muted-foreground">
                                <div className="flex justify-between">
                                    <p>Subtotal</p>
                                    <p className="text-gray-900 dark:text-gray-100">{formatPrice(orderTotal)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Transaction Fee</p>
                                    <p className="text-gray-900 dark:text-gray-100">Free</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6 text-gray-900 dark:text-gray-100">
                                    <p className="text-base">Total</p>
                                    <p className="text-base">{formatPrice(orderTotal + 0)}</p>
                                </div>
                            </div>

                            <PaymentStatus isPaid={order._isPaid} orderEmail={(order.user as User).email} orderId={order.id} />

                            <div className="mt-16 border-t border-gray-200 dark:border-gray-800 py-6 text-right">
                                <Link href='/products' className="text-sm font-medium text-purple-600 hover:text-purple-500">Continue Shopping &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ClearCartEffect isPaid={order._isPaid} />
        </main>
    )
}

export default Page