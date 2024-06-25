"use client"

import { useEffect } from "react"
import { useCart } from "@/hooks/use-cart"

export const ClearCartEffect = ({ isPaid }: { isPaid: boolean }) => {
	const { clearCart } = useCart()

	useEffect(() => {
		if (isPaid) {
			clearCart()
		}
	}, [isPaid, clearCart])

	return null
}
