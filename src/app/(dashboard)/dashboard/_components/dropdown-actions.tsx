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
	productStatus?: string;

	customerId?: string;
	customerUser?: string;
	customerEmail?: string;
	customerRole?: string;
	customerVerified?: boolean;

	license?: Keys;
};

export const DropdownActions = ({ orderId, userEmail, licenseKey, productId, customerId, license, customerEmail, customerUser, customerRole, customerVerified, productStatus }: DropdownActionsProps) => {
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

	const assignLicenseKey = async () => {
		const keyToAssign = window.prompt('Insert License Key')

		if (!keyToAssign)
			return

		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					licenseKey: `${keyToAssign}`
				})
			})

			if (!response.ok)
				throw new Error('Failed to assign license')

			toast.success('Successfully assigned license')
			router.refresh();
		} catch (error) {
			toast.error('Failed to assign license')
		}
	}

	const archiveProduct = async () => {
		const confirmed = window.confirm("Are you sure you want to archive this product");

		if (!confirmed)
			return;

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					approvedForSale: 'pending'
				})
			})

			if (!response.ok) {
				throw new Error('Failed to archive product');
			}

			toast.success('Successfully archived product')
			router.refresh();
		} catch (error) {
			toast.error("Failed to archive product");
		}
	}

	const approveProduct = async () => {
		const confirmed = window.confirm("Are you sure you want to approve this product");

		if (!confirmed)
			return;

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					approvedForSale: 'approved'
				})
			})

			if (!response.ok) {
				throw new Error('Failed to approved product');
			}

			toast.success('Successfully approved product')
			router.refresh();
		} catch (error) {
			toast.error("Failed to approve product");
		}
	}

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
			router.refresh()
			router.refresh();
		} catch (error) {
			toast.error('Failed to delete Key')
		}
	}

	const verifyUser = async () => {
		const confirmed = window.confirm('Are you sure you want to verify this user?');

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/users/${customerId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_verified: true,
					_verificationToken: ""
				})
			});

			if (!response.ok) {
				throw new Error('Failed to verify user');
			}

			toast.success('Successfully Verified User')
			router.refresh();
		} catch (error) {
			toast.error('Failed to verify user')
		}
	};

	const unverifyUser = async () => {
		const confirmed = window.confirm('Are you sure you want to unverify this user?');

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/users/${customerId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_verified: false,
					_verificationToken: ""
				})
			});

			if (!response.ok) {
				throw new Error('Failed to unverify user');
			}

			toast.success('Successfully Unverified User')
			router.refresh();
		} catch (error) {
			toast.error('Failed to unverify user')
		}
	};

	const makeReseller = async () => {
		const confirmed = window.confirm('Are you sure you want to make this user a Reseller?')

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/users/${customerId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					role: "reseller"
				})
			})

			if (!response.ok) {
				throw new Error('Failed to make this user a reseller')
			}

			toast.success('This user is now a Reseller')
			router.refresh();
		} catch (error) {
			toast.error('Failed to make this user a reseller')
		}
	}

	const makeCustomer = async () => {
		const confirmed = window.confirm('Are you sure you want to make this user a Customer?')

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/users/${customerId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					role: "customer"
				})
			})

			if (!response.ok) {
				throw new Error('Failed to make this user a customer')
			}

			toast.success('This user is now a Customer')
			router.refresh();
		} catch (error) {
			toast.error('Failed to make this user a customer')
		}
	}

	if (orderId && userEmail && licenseKey) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={deleteOrder}>Delete</DropdownMenuItem>
						<DropdownMenuItem onClick={assignLicenseKey}>{licenseKey === '[N/A]' ? 'Assign' : 'Reassign'} License</DropdownMenuItem>
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
						{/* <DropdownMenuItem onClick={deleteProduct}>Delete</DropdownMenuItem> */}
						<DropdownMenuItem onClick={productStatus === 'pending' ? approveProduct : archiveProduct}>
							{productStatus === 'pending' ? 'Approve' : 'Archive'}
						</DropdownMenuItem>
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
						{customerVerified ? (
							<DropdownMenuItem onClick={unverifyUser}>Unverify</DropdownMenuItem>
						) : (
							<DropdownMenuItem onClick={verifyUser}>Verify</DropdownMenuItem>
						)}
						{customerRole === 'reseller' ? (
							<DropdownMenuItem onClick={makeCustomer}>Make Customer</DropdownMenuItem>
						) : (
							<DropdownMenuItem onClick={makeReseller}>Make Reseller</DropdownMenuItem>
						)}
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
						{license?.banned ? (
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
