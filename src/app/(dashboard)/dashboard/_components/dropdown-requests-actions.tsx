"use client"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

type DropdownActionsProps = {
	license?: string;
};

export const DropdownRequestsActions = ({ license }: DropdownActionsProps) => {
	const router = useRouter();

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const copyToClipboard = (text: string) => {
		copy(text);
		toast.success(`Copied to clipboard: ${text}`);
	};

	const banLicense = async () => {
		const confirmed = window.confirm('Are you sure you want to ban this Key?');

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/ban-license?key=${license}`)

			toast.success('Successfully banned license')
			router.refresh();
		} catch (error) {
			toast.error('Failed to ban Key')
		}
	}

	const refuseBan = async () => {
		const confirmed = window.confirm('Are you sure you want to refuse this ban request?')

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/refuse-ban`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					licenseKey: license,
				})
			});

			toast.success(`Successfully refused request`);
			router.refresh();
		} catch (error) {
			toast.error(`Failed to refuse request`);
		}
	}

	if (license) {
		return (
			<DropdownMenuContent align="end">
				{isMounted && (
					<>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={banLicense}>Approve Request</DropdownMenuItem>
						<DropdownMenuItem onClick={refuseBan}>Deny Request</DropdownMenuItem>
						<DropdownMenuItem onClick={() => copyToClipboard(license)}>Copy License</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		)
	}
};
