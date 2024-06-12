/*
 * This component represents a page for displaying details of a single product.
 * It fetches product data based on the productId from the URL params.
 * It also fetches and displays
 * the product details, images, and an add-to-cart button.
 */

import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ImageSlider } from "@/components/image-slider"
import { ProductReel } from "@/components/product-reel"
import renderRichText, { RichTextNode } from "@/components/richText"
import { PRODUCT_CATEGORY } from "@/config"
import { getPayloadClient } from "@/get-payload"
import { formatPrice } from "@/lib/utils"
import { Check, Shield } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        productId: string
    }
}

const Page = async ({ params }: PageProps) => {
    // Destructuring productId from params
    const { productId } = params;

    // Fetching payload data
    const payload = await getPayloadClient();

    // Fetching product data based on productId
    const { docs: products } = await payload.find({
        collection: 'products',
        limit: 1,
        where: {
            id: {
                equals: productId
            },
            approvedForSale: {
                equals: 'approved'
            }
        }
    });

    // Extracting the first product from the fetched data
    const [product] = products;

    // Returning a not found page if no product is found
    if (!product) return notFound();

    // Breadcrumbs for navigation
    const BREADCRUMBS = [
        { id: 1, name: "Home", href: "/" },
        { id: 2, name: "Products", href: "/products" },
        { id: 3, name: `${product.name}`, href: `/product/${product.id}` }
    ];

    // Finding the label for the product category
    const label = PRODUCT_CATEGORY.find(({ value }) => value === product.category)?.label;

    // Valid image URLs for the product
    const validUrls = product.images.map(({ image }) => (typeof image === "string" ? image : image.url)).filter(Boolean) as string[];

    // Rendering product description
    const description = Array.isArray(product.description)
        ? renderRichText(product.description as RichTextNode[])
        : <span>{product.description}</span>;

    // Rendering the UI
    return (
        <MaxWidthWrapper className="bg-white dark:bg-black">
            <div className="bg-white dark:bg-black">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    {/* Product Details */}
                    <div className="lg:max-w-lg lg:self-end">
                        <ol className="flex items-center space-x-2">
                            {BREADCRUMBS.map((breadcrumb, i) => (
                                <li key={breadcrumb.href}>
                                    <div className="flex items-center text-sm">
                                        <Link href={breadcrumb.href} className="font-medium text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100">
                                            {breadcrumb.name}
                                        </Link>
                                        {i !== BREADCRUMBS.length - 1 ? (
                                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden='true' className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-700">
                                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                            </svg>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-4">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">{product.name}</h1>
                        </div>

                        <section className="mt-4">
                            <div className="flex items-center">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(product.price)}</p>

                                <div className="ml-4 border-l text-muted-foreground border-gray-200 dark:border-gray-800 pl-4">
                                    {label}
                                </div>
                            </div>

                            <div className="mt-4 space-y-6">
                                <div className="text-base text-muted-foreground">
                                    {description}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center">
                                <Check aria-hidden='true' className="h-5 w-5 flex-shrink-0 text-green-500" />
                                <p className="ml-2 text-sm text-muted-foreground">Eligible for Instant Delivery</p>
                            </div>
                        </section>
                    </div>

                    {/* Product Images */}
                    <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
                        <div className="aspect-square rounded-lg">
                            <ImageSlider urls={validUrls} />
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                        <div>
                            <div className="mt-10">
                                <AddToCartButton product={product} />
                            </div>
                            <div className="mt-6 text-center">
                                <div className="group inline-flex text-sm font-medium">
                                    <Shield aria-hidden='true' className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-600" />
                                    <span className="text-muted-foreground">No Refund Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductReel href="/products" query={{ category: product.category, limit: 4 }} title={`Similar ${label}`} subtitle={`Browse similar high-quality ${label === "Rainbow Six" ? `${label} cheats` : label} just like '${product.name}'`} />
        </MaxWidthWrapper>
    )
}

export default Page