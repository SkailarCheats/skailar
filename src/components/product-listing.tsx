import React, { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import { Product } from "@/payload-types";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORY } from "@/config";
import { ImageSlider } from "./image-slider";
import { Check, X } from "lucide-react";

interface ProductListingProps {
    product: Product | null;
    index: number;
}

export const ProductListing = ({ index, product }: ProductListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [stockLicenses, setStockLicenses] = useState<Record<string, string[]>>({});

    const { data: licensesData } = trpc.getStockLicenses.useQuery();

    useEffect(() => {
        if (licensesData) {
            setStockLicenses(licensesData);
        }
    }, [licensesData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    if (!product || !isVisible) return <ProductPlaceholder />;

    const label = PRODUCT_CATEGORY.find(({ value }) => value === product.category)?.label;

    const validUrls = product.images.map(({ image }) => (typeof image === "string" ? image : image.url)).filter(Boolean) as string[];

    if (isVisible && product) return (
        <Link className={cn("invisible h-full w-full cursor-pointer group/main", {
            "visible animate-in fade-in-5": isVisible
        })} href={`/product/${product.id}`}>
            <div className="flex flex-col w-full">
                <ImageSlider urls={validUrls} />
                <h3 className="mt-4 font-medium text-sm text-gray-700 dark:text-gray-300">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
                <p className="mt-1 font-medium text-sm text-gray-900 dark:text-gray-100">{formatPrice(product.price)}</p>
                <span className="flex items-center justify-end">
                    {stockLicenses[product.id]?.length ?? 0 > 0 ? (
                        <>
                            <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                            <p className="ml-1.5 text-sm text-muted-foreground">{stockLicenses[product.id]?.length} In Stock</p>
                        </>
                    ) : (
                        <>
                            <X className="h-5 w-5 flex-shrink-0 text-red-500" />
                            <p className="ml-1.5 text-sm text-muted-foreground">{stockLicenses[product.id]?.length ?? 'Not in Stock'}</p>
                        </>
                    )}
                </span>
            </div>
        </Link>
    );
};

const ProductPlaceholder = () => {
    return (
        <div className="flex flex-col w-full">
            <div className="relative bg-zinc-100 dark:bg-zinc-900 aspect-square w-full overflow-hidden rounded-xl">
                <Skeleton className="h-full w-full" />
            </div>

            <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
            <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
            <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
        </div>
    );
};
