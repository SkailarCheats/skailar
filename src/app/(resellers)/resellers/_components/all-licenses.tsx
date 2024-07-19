"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSellerBaseURL } from "@/lib/urls";
import { User } from "@/payload-types";
import { Key } from "lucide-react";
import { useEffect, useState } from "react";

interface LicenseKey {
	id: number;
	key: string;
	note: string | null;
	expires: string;
	status: string;
	level: string;
	genby: string;
	gendate: number;
	usedon: number | null;
	usedby: string | null;
	app: string;
	banned: string | null;
}

interface ApiResponse {
	success: boolean;
	message: string;
	keys: LicenseKey[];
}

export const AllLicenses = ({ user }: { user: User }) => {
	const [numLicenses, setNumLicenses] = useState(0);

	useEffect(() => {
		const fetchLicenses = async () => {
			try {
				const response = await fetch(`${getSellerBaseURL}&type=fetchallkeys&format=json`);
				const data: ApiResponse = await response.json();

				if (data.success && data.keys) {
					const userKeys = data.keys.filter((key: LicenseKey) => key.genby === user.username);

					setNumLicenses(userKeys.length);

				}
			} catch (error) {
				console.error("Error fetching licenses: ", error);
			}
		};

		fetchLicenses();
	}, [user.username]);

	return (
		<Card x-chunk="dashboard-01-chunk-1">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Licenses
				</CardTitle>
				<Key className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold blur hover:blur-none">+{numLicenses}</div>
				<p className="text-xs text-muted-foreground">
					You have generated a total of <span className="blur hover:blur-none">{numLicenses}</span> License Keys.
				</p>
			</CardContent>
		</Card>
	);
};
