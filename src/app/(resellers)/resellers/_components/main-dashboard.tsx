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
import { getSellerBaseURL } from "@/lib/urls"

export async function MainDashboard() {
	async function getBalance(username: string) {
		const url = `${getSellerBaseURL}&type=getbalance&username=${username}&appname=Skailar`;

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

	if (!user || user.role !== 'reseller') {
		return redirect('/')
	}

	const balance = await getBalance(user.username);

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
						<div className="text-2xl font-bold blur hover:blur-none">{balance ? balance.day : '[N/A]'}</div>
						<p className="text-xs text-muted-foreground">
							You can generate up to <span className="blur hover:blur-none">{balance ? balance.day : '[N/A]'}</span> day keys.
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Week Balance</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold blur hover:blur-none">{balance ? balance.week : '[N/A]'}</div>
						<p className="text-xs text-muted-foreground">
							You can generate up to <span className="blur hover:blur-none">{balance ? balance.week : '[N/A]'}</span> week keys.
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Month Balance</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold blur hover:blur-none">{balance ? balance.month : '[N/A]'}</div>
						<p className="text-xs text-muted-foreground">
							You can generate up to <span className="blur hover:blur-none">{balance ? balance.month : '[N/A]'}</span> month keys.
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

