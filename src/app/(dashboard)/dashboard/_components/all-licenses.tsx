"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSellerBaseURL } from "@/lib/urls";
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

export const AllLicenses = () => {
	const [numLicenses, setNumLicenses] = useState(0);
	const [licensesChangePercent, setLicensesChangePercent] = useState(0);
	const [numLicensesPreviousMonth, setNumLicensesPreviousMonth] = useState(0);

	useEffect(() => {
		const fetchLicenses = async () => {
			try {
				const response = await fetch(`${getSellerBaseURL}&type=fetchallkeys&format=json`);
				const data: ApiResponse = await response.json();

				if (data.success && data.keys) {
					const currentDate = new Date();
					const currentMonth = currentDate.getMonth();
					const currentYear = currentDate.getFullYear();
					const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
					const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

					const currentMonthKeys = data.keys.filter((key: LicenseKey) => {
						const keyDate = new Date(key.gendate * 1000);
						return keyDate.getMonth() === currentMonth && keyDate.getFullYear() === currentYear;
					});

					const previousMonthKeys = data.keys.filter((key: LicenseKey) => {
						const keyDate = new Date(key.gendate * 1000);
						return keyDate.getMonth() === previousMonth && keyDate.getFullYear() === previousMonthYear;
					});

					setNumLicenses(currentMonthKeys.length);
					setNumLicensesPreviousMonth(previousMonthKeys.length);

					const changePercent = previousMonthKeys.length === 0
						? 0
						: ((currentMonthKeys.length - previousMonthKeys.length) / previousMonthKeys.length) * 100;

					setLicensesChangePercent(changePercent);
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
					{numLicensesPreviousMonth === 0
						? "No data for last month"
						: `${licensesChangePercent >= 0 ? '+' : ''}${licensesChangePercent.toFixed(2)}% from last month`}
				</p>
			</CardContent>
		</Card>
	);
};
