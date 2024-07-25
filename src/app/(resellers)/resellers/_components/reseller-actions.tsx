"use client"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Keys } from "./licenses-list";
import { User } from "@/payload-types";
import { AlertDialog } from "./alert-dialog";

type DropdownActionsProps = {
	user?: User;
	license?: Keys;
};

export const ResellerActions = ({ license, user }: DropdownActionsProps) => {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const copyToClipboard = (text: string) => {
		copy(text);
		toast.success(`Copied to clipboard: ${text}`);
	};

	const requestBan = async (reason: string) => {
		try {
			const response = await fetch(`/api/ban-request`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: user?.id,
					licenseKey: license?.key,
					reason: reason  // Include the reason in the request body
				})
			});

			if (!response.ok) {
				throw new Error('Failed to send request');
			}

			toast.success(`Successfully sent request`);
			router.refresh();
		} catch (error) {
			toast.error(`Failed to send request`);
		}
	};

	const handleRequestBan = () => {
		setIsAlertOpen(true);
	};

	const requestHwid = async () => {
		const confirmed = window.confirm(`Are you sure you want to send an HWID Request for ${license?.key}?`); // TODO: Change with alert-dialog

		if (!confirmed) {
			return;
		}

		try {
			const response = await fetch(`/api/request-hwid`, {
				method: 'POST'
			});

			if (!response.ok) {
				throw new Error('Failed to send HWID Request');
			}

			toast.success(`Successfully sent HWID Request`);
			router.refresh();
		} catch (error) {
			toast.error(`Failed to send HWID Request`);
		}
	};

	if (license) {
		return (
			<>
				<DropdownMenuContent align="end">
					{isMounted && (
						<>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={handleRequestBan}>Request Ban</DropdownMenuItem>
							<DropdownMenuItem onClick={() => requestHwid()}>Request HWID</DropdownMenuItem>
							<DropdownMenuItem onClick={() => copyToClipboard(license.id)}>Copy ID</DropdownMenuItem>
							<DropdownMenuItem onClick={() => copyToClipboard(license.key)}>Copy License</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
				<AlertDialog
					isOpen={isAlertOpen}
					onClose={() => setIsAlertOpen(false)}
					onConfirm={requestBan}  // Pass the requestBan function to the AlertDialog
				/>
			</>
		);
	}
};
