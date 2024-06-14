"use client"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { getPayloadClient } from "@/get-payload";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

type DropdownActionsProps = {
	orderId?: string;
	userEmail?: string;
	licenseKey?: string | null;
	productId?: string;
	customerId?: string;
	licenseId?: string;
};

export const DropdownActions = ({ orderId, userEmail, licenseKey, productId, customerId, licenseId }: DropdownActionsProps) => {
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
		const confirmed = window.confirm('Are you sure you want to delete this order?'); // TODO: Change with alert-dialog

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
		const confirmed = window.confirm('Are you sure you want to delete this Product?'); // TODO: Change with alert-dialog

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

	const deleteCustomer = async () => {
		const confirmed = window.confirm('Are you sure you want to delete this User?'); // TODO: Change with alert-dialog

		if (!confirmed) {
			return;
		}

		try {
			const response = await fetch(`/api/users/${customerId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete user');
			}

			toast.success(`Successfully deleted user`);
			router.refresh();
		} catch (error) {
			toast.error(`Failed to delete user`);
		}
	};

	const banLicense = async () => {
		const confirmed = window.confirm('Are your sure you wanto to ban this Keys?');

		if (!confirmed) return;

		try {
			const response = await fetch(`https://keyauth.win/api/seller/?sellerkey=53d4ed15dd0506aceef5b63a40bcc83f&type=ban&key=${licenseId}&reason=Automatic%20Ban&userToo=false`)

			if (!response.ok) {
				throw new Error('Failed to Ban key')
			}

			toast.success('Successfully banned license')
			router.refresh();
		} catch (error) {
			toast.error('Failed to ban Key')
		}
	}

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

	if (customerId) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={deleteCustomer}>Delete</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(customerId)}>Copy ID</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		)
	}

	if (licenseId) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>Delete</DropdownMenuItem>
						<DropdownMenuItem onClick={banLicense}>Ban</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(licenseId)}>Copy Key</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		)
	}
};
