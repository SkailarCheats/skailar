"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";

export const CheckLicense: React.FC = () => {
	const [license, setLicense] = useState<string>("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLicense(e.target.value);
	};

	const checkLicense = async () => {
		try {
			const response = await fetch(`/api/check-license?license=${license}`);
			const data = await response.json();
			if (data.success) {
				toast.success("License is valid");
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
					Enter your license key to verify its validity.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Input
					type="text"
					value={license}
					onChange={handleInputChange}
					placeholder="Enter your license key"
					className="w-full p-2 border rounded mb-3"
				/>
				<Button size="sm" className="w-full mt-2" onClick={checkLicense}>
					Verify
				</Button>
			</CardContent>
		</Card>
	);
};
