'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

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

export const ActiveKeys = () => {
	const [numLicenses, setNumLicenses] = useState(0);
	const [numKeysLastHour, setNumKeysLastHour] = useState(0);

	useEffect(() => {
		const fetchLicenses = async () => {
			try {
				const response = await fetch(`https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=fetchallkeys&format=json`);
				const data: ApiResponse = await response.json();

				if (data.success && data.keys) {
					const currentDate = new Date();
					const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
					const oneHourAgoTimestamp = currentTimestamp - 3600;

					const keysLastHour = data.keys.filter(key => {
						const keyTimestamp = key.gendate;
						return keyTimestamp >= oneHourAgoTimestamp && keyTimestamp <= currentTimestamp && (key.status === "Used" || keyTimestamp > oneHourAgoTimestamp);
					});

					setNumLicenses(data.keys.filter(key => key.status === "Used").length);
					setNumKeysLastHour(keysLastHour.length);
				} else {
					console.error("Failed to fetch licenses: ", data.message);
				}
			} catch (error) {
				console.error("Error fetching licenses: ", error);
			}
		};

		fetchLicenses();

	}, []);

	return (
		<Card x-chunk="dashboard-01-chunk-3">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Active Now</CardTitle>
				<Activity className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					+{numLicenses}
				</div>
				<p className="text-xs text-muted-foreground">
					+{numKeysLastHour} in the last hour
				</p>
			</CardContent>
		</Card>
	);
};

export default ActiveKeys;
