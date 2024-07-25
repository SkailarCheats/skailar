'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

type AlertDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => void;
};

export const AlertDialog = ({ isOpen, onClose, onConfirm }: AlertDialogProps) => {
	const [reason, setReason] = useState<string>("");
	const [error, setError] = useState<boolean>(false);

	const handleConfirm = () => {
		onConfirm(reason);
		setReason("");
		onClose();
	};

	const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > 50) {
			setError(true);
			toast.error("Reason cannot exceed 50 characters.")
		} else if (value.length < 5) {
			setError(true);
			toast.error("Reason must be at least 5 characters long.");
		} else {
			setError(false);
		}
		setReason(value);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-black p-6 rounded shadow-md max-w-md w-full">
				<h2 className="text-lg font-semibold mb-4">Ban Request</h2>
				<p className="mb-4">Please enter the reason for the ban (5-15 characters):</p>
				<Input
					type="text"
					value={reason}
					onChange={handleReasonChange}
					className="w-full p-2 border border-gray-700 rounded mb-2"
				/>
				<div className="flex justify-end gap-2">
					<Button onClick={onClose} variant="secondary">Cancel</Button>
					<Button
						onClick={handleConfirm}
						variant="default"
						className="px-4 py-2"
						disabled={!!error || reason.length < 5}
					>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
};
