"use client"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

type DropdownActionsProps = {
	orderId?: string;
	userEmail?: string;
	licenseKey?: string | null;
	productId?: string;
};

export const DropdownActions = ({ orderId, userEmail, licenseKey, productId }: DropdownActionsProps) => {
	const router = useRouter();

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const copyToClipboard = (text: string) => {
		copy(text);
		toast.success(`Copied to clipboard: ${text}`);
	};

	const deleteOrder = async () => {
		const confirmed = window.confirm('Are you sure you want to delete this order?');

		if (!confirmed) {
			return;
		}

		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete order');
			}

			toast.success(`Successfully deleted order`);
			router.refresh();
		} catch (error) {
			toast.error(`Failed to delete order`);
		}
	};

	const deleteProduct = async () => {
		const confirmed = window.confirm('Are you sure you want to delete this Product?');

		if (!confirmed) {
			return;
		}

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete product');
			}

			toast.success(`Successfully deleted product`);
			router.refresh();
		} catch (error) {
			toast.error(`Failed to delete product`);
		}
	};


	if (orderId && userEmail && licenseKey) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={deleteOrder}>Delete</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(orderId)}>Copy ID</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(userEmail)}>Copy Email</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(licenseKey ? licenseKey : '[N/A]')}>Copy License</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		);
	}

	if (productId) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={deleteProduct}>Delete</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(productId)}>Copy ID</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		);
	}
};
