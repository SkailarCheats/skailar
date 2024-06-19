import {
	Key
} from "lucide-react"

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getServerSideUser } from "@/lib/payload-utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AllLicenses } from "./all-licenses"
import { LicensesList } from "./licenses-list"

export async function MainDashboard() {
	async function getBalance(username: string) {
		const url = `https://api.skailar.com/api/seller/?sellerkey=5d9da464a2530837e8cefc57245e1644&type=getbalance&username=${username}&appname=Skailar`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.success) {
				return data.balance;
			} else {
				throw new Error("Failed to fetch balance.");
			}
		} catch (error) {
			console.error("Error fetching balance:", error);
			return null;
		}
	}

	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role === 'customer') {
		return redirect('/')
	}

	const balance = await getBalance(user.username);

	if (!balance) {
		return <div>[N/A]</div>
	}

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				<AllLicenses user={user} />
				<Card x-chunk="dashboard-01-chunk-0">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Day Balance
						</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{balance.day}</div>
						<p className="text-xs text-muted-foreground">
							You can generate up to {balance.day} day keys.
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Week Balance</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{balance.week}</div>
						<p className="text-xs text-muted-foreground">
							You can generate up to {balance.week} week keys.
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Month Balance</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{balance.month}</div>
						<p className="text-xs text-muted-foreground">
							You can generate up to {balance.month} month keys.
						</p>
					</CardContent>
				</Card>
			</div>
			<div>
				<LicensesList user={user} active />
			</div>
		</>
	)
}

