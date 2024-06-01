"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { useCart } from "@/hooks/use-cart"
import { Product } from "@/payload-types"

export const AddToCartButton = ({ product, isDisabled }: { product: Product, isDisabled: boolean }) => {
    const { addItem } = useCart();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSuccess(false)
        }, 2000)

        return () => clearTimeout(timeout)
    }, [isSuccess])

    return (
        <Button
            onClick={() => {
                addItem(product)
                setIsSuccess(true)
            }}
            size='lg'
            className="w-full"
            disabled={isSuccess || isDisabled}
        >
            {isDisabled && "Not in Stock"}
            {isSuccess && "Added!"}
            {!isSuccess && !isDisabled && "Add to Cart"}
        </Button>
    )
}