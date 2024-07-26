import { PRODUCT_CATEGORY } from "@/config";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { Check, InfinityIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageSlider } from "./image-slider";
import { Skeleton } from "./ui/skeleton";

interface ProductListingProps {
    product: Product | null;
    index: number;
}

export const ProductListing = ({ index, product }: ProductListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    if (!product || !isVisible) return <ProductPlaceholder />;

    const label = PRODUCT_CATEGORY.find(({ value }) => value === product.category)?.label;

    const validUrls = product.images.map(({ image }) => (typeof image === "string" ? image : image)).filter(Boolean) as string[];

    if (isVisible && product) return (
        <Link className={cn("invisible h-full w-full cursor-pointer group/main", {
            "visible animate-in fade-in-5": isVisible
        })} href={`/product/${product.id}`}>
            <div className="flex flex-col w-full">
                <ImageSlider urls={validUrls} />
                <h3 className="mt-4 font-medium text-sm text-gray-700 dark:text-gray-300">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium text-sm text-gray-900 dark:text-gray-100">{formatPrice(product.price)}</p>
                <span className="flex items-center justify-end">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <p className="flex items-center ml-1.5 text-sm text-muted-foreground">
                        <InfinityIcon className="h-5 w-5 mr-1 font-bold flex-shrink-0" />
                        In Stock
                    </p>
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
