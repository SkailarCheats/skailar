"use client"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Keys } from "./licenses-list";

type DropdownActionsProps = {
	orderId?: string;

	userEmail?: string;
	licenseKey?: string | null;
	productId?: string;

	customerId?: string;
	customerUser?: string;
	customerEmail?: string;

	license?: Keys;
};

export const DropdownActions = ({ orderId, userEmail, licenseKey, productId, customerId, license, customerEmail, customerUser }: DropdownActionsProps) => {
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
		const confirmed = window.confirm('Are your sure you want to ban this Key?');

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/ban-license?key=${license?.key}`)

			if (!response.ok) {
				throw new Error('Failed to Ban key')
			}

			toast.success('Successfully banned license')
			router.refresh();
		} catch (error) {
			toast.error('Failed to ban Key')
		}
	}

	const unbanLicense = async () => {
		const confirmed = window.confirm('Are your sure you want to unban this Key?');

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/unban-license?key=${license?.key}`)

			if (!response.ok) {
				throw new Error('Failed to Unban key')
			}

			toast.success('Successfully unbanned license')
			router.refresh();
		} catch (error) {
			toast.error('Failed to unban Key')
		}
	}

	const deleteLicense = async () => {
		const confirmed = window.confirm('Are your sure you want to delete this Key?');

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/delete-license?key=${license?.key}`)

			if (!response.ok) {
				throw new Error('Failed to delete key')
			}

			toast.success('Successfully deleted license')
			router.refresh();
		} catch (error) {
			toast.error('Failed to delete Key')
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

	if (customerId && customerEmail && customerUser) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={deleteCustomer}>Delete</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(customerId)}>Copy ID</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(customerUser)}>Copy User</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(customerEmail)}>Copy Email</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		)
	}

	if (license) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={deleteLicense}>Delete</DropdownMenuItem>
						{license.banned ? (
							<DropdownMenuItem onClick={unbanLicense}>Unban</DropdownMenuItem>
						) : (
							<DropdownMenuItem onClick={banLicense}>Ban</DropdownMenuItem>
						)}
						<DropdownMenuItem onClick={() => copyToClipboard(license.id)}>Copy ID</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(license.key)}>Copy License</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		)
	}
};
