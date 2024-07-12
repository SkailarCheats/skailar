"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSellerBaseURL } from "@/lib/urls";
import { User } from "@/payload-types";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface Balance {
	day: string;
	week: string;
	month: string;
	total_keys: number;
}

export const GenerateForm = ({ user }: { user: User }) => {
	const [amount, setAmount] = useState<number>(1);
	const [expiry, setExpiry] = useState<string>("1");
	const [level, setLevel] = useState<string>("0")
	const [balance, setBalance] = useState<Balance | null>(null);

	const router = useRouter();

	const fetchBalance = async () => {
		const url = `${getSellerBaseURL}&type=getbalance&username=${user.username}&appname=Skailar`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.success) {
				setBalance(data.balance);
			} else {
				toast.error("Failed to fetch balance.");
			}
		} catch (error) {
			toast.error("An error occurred while fetching the balance.");
		}
	};

	useEffect(() => {
		fetchBalance();
	}, [fetchBalance]);

	const updateBalance = async (usedBalance: { day: number, week: number, month: number }) => {
		const url = `${getSellerBaseURL}&type=setbalance&username=${user.username}&day=${usedBalance.day}&week=${usedBalance.week}&month=${usedBalance.month}&threemonth=0&sixmonth=0&lifetime=0`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (!data.success) {
				toast.error("Failed to update balance.");
			}
		} catch (error) {
			toast.error("An error occurred while updating the balance.");
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!balance) {
			toast.error("Balance information is not available.");
			return;
		}

		const { day, week, month } = balance;

		const dayBalance = parseInt(day, 10);
		const weekBalance = parseInt(week, 10);
		const monthBalance = parseInt(month, 10);

		if (expiry === "1" && (dayBalance === 0 || amount > dayBalance)) {
			toast.warning(`You can generate up to ${dayBalance} one-day key(s).`);
			return;
		}

		if (expiry === "7" && (weekBalance === 0 || amount > weekBalance)) {
			toast.warning(`You can generate up to ${weekBalance} seven-day key(s).`);
			return;
		}

		if (expiry === "30" && (monthBalance === 0 || amount > monthBalance)) {
			toast.warning(`You can generate up to ${monthBalance} thirty-day key(s).`);
			return;
		}

		const url = `${getSellerBaseURL}&type=add&format=json&expiry=${expiry}&mask=***************&level=${level}&amount=${amount}&owner=${user.username}&character=2&note=Generated%20By%20${user.username}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.success) {
				toast.success(data.message);
				const usedBalance = {
					day: expiry === "1" ? -amount : 0,
					week: expiry === "7" ? -amount : 0,
					month: expiry === "30" ? -amount : 0
				};
				await updateBalance(usedBalance);
				fetchBalance();  // Fetch updated balance after key generation
				router.refresh();
				router.push('/resellers/licenses');
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("An error occurred while generating the license key.");
		}
	};

	const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAmount(parseInt(e.target.value, 10));
	};

	const products = [
		{
			id: 1,
			name: "Ergonomic Desk Chair",
			description: "Comfortable and supportive office chair",
			price: 199.99,
		},
		{
			id: 2,
			name: "Wireless Bluetooth Headphones",
			description: "High-quality audio with long battery life",
			price: 99.99,
		},
		{
			id: 3,
			name: "Programmable Coffee Maker",
			description: "Brew your perfect cup of coffee every morning",
			price: 79.99,
		},
		{
			id: 4,
			name: "Portable Bluetooth Speaker",
			description: "Powerful sound in a compact design",
			price: 49.99,
		},
		{
			id: 5,
			name: "Adjustable Standing Desk",
			description: "Improve your posture and productivity",
			price: 399.99,
		},
	]

	return (
		<main className="flex-1 p-6">
			<div className="border rounded-lg shadow-sm overflow-hidden">
				<table className="w-full">
					<thead className="bg-muted text-muted-foreground">
						<tr>
							<th className="py-3 px-4 text-left">Product</th>
							<th className="py-3 px-4 text-left">Description</th>
							<th className="py-3 px-4 text-right">Price</th>
							<th className="py-3 px-4 text-right">Action</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
								<td className="py-4 px-4 font-medium">{product.name}</td>
								<td className="py-4 px-4 text-muted-foreground">{product.description}</td>
								<td className="py-4 px-4 text-right font-medium">${product.price.toFixed(2)}</td>
								<td className="py-4 px-4 text-right">
									<Button size="sm" variant="outline">
										Buy
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	);
};
