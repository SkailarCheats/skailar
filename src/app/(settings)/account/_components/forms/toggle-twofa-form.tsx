"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

interface FormData {
	status: boolean;
}

interface Props {
	userId: string;
	isTwoFactorEnabled: boolean;
}

export const ToggleTwoFAForm: React.FC<Props> = ({ userId, isTwoFactorEnabled }) => {
	const router = useRouter();

	const { handleSubmit } = useForm<FormData>();
	const [status, setStatus] = useState(isTwoFactorEnabled);

	const toggleTwoFAMutation = trpc.auth.toggleTwoFA.useMutation();

	const onSubmit: SubmitHandler<FormData> = async () => {
		try {
			const result = await toggleTwoFAMutation.mutateAsync({
				id: userId,
				status: !status
			});

			if (result.success) {
				const newStatus = !status;
				toast.success(`Successfully ${newStatus ? 'enabled' : 'disabled'} 2FA`);
				setStatus(newStatus);
			}

			router.refresh();
		} catch (error) {
			toast.error('An error occurred');
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Label htmlFor="2fa">Two-Factor Authentication</Label>
				<div className="grid gap-2">
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Two-factor authentication is currently {status ? 'enabled' : 'disabled'}.
						</p>
					</div>
					<Popover>
						<PopoverTrigger asChild>
							<div>
								<Button type="submit" disabled className="w-full" variant="outline">
									{status ? 'Disable' : 'Enable'} Two-Factor Auth
								</Button>
							</div>
						</PopoverTrigger>
						<PopoverContent className="w-full">
							<p>This feature is currently unavailable. Please try again later.</p>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</form>
	)
}
