"use client"

import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { ProductReel } from "@/components/product-reel";
import { PRODUCT_CATEGORY } from "@/config";
import { useParams } from 'next/navigation';

const ProductsPage = () => {
    const params = useParams();
    const category = params.category as string;

    const label = PRODUCT_CATEGORY.find(({ value }) => value === category)?.label;

    return (
        <MaxWidthWrapper>
            <ProductReel
                title={label ?? "Browse high-quality cheats"}
                query={{
                    category,
                    limit: 40,
                }}
            />
        </MaxWidthWrapper>
    );
};

export default ProductsPage;