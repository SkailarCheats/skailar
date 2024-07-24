"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate, formatExpires } from "@/lib/utils";
import { toast } from "sonner";

export const CheckLicenseForm = ({ currentReseller }: { currentReseller: string }) => {
	const [license, setLicense] = useState<string>("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLicense(e.target.value);
	};

	const checkLicense = async () => {
		try {
			const response = await fetch(`/api/info-license?key=${license}`);
			const data = await response.json();

			if (data.success) {
				if (data.createdby !== currentReseller) {
					toast.warning("You are not the owner of this license key.");
					setLicense('');
					return;
				}

				if (data.status === 'Used') {
					toast.info(`Key has been activated by ${data.usedby} on ${formatDate(data.usedon)}`);
				} else if (data.status === 'Not Used') {
					toast.success(`Key has not been activated. Expires in ${formatExpires(data.duration)}`);
				} else if (data.status === 'Banned') {
					toast.error(`Key is banned`);
				}
				setLicense('');
			} else {
				toast.error("License is invalid");
				setLicense('');
			}
		} catch (error) {
			toast.error("Internal Error");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Check License</CardTitle>
				<CardDescription>
					Check license&apos;s validity.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Input
					type="text"
					value={license}
					onChange={handleInputChange}
					placeholder="Enter your license key"
					className="w-full p-2 border rounded mb-3"
					autoComplete="off"
					maxLength={15}
				/>
				<Button size="sm" className="w-full mt-2" onClick={checkLicense}>
					Verify
				</Button>
			</CardContent>
		</Card>
	);
};
