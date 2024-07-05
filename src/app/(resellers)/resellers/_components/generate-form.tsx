"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/payload-types";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
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
		const url = `https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=getbalance&username=${user.username}&appname=Skailar`;

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
		const url = `https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=setbalance&username=${user.username}&day=${usedBalance.day}&week=${usedBalance.week}&month=${usedBalance.month}&threemonth=0&sixmonth=0&lifetime=0`;

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

		const url = `https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=add&format=json&expiry=${expiry}&mask=***************&level=${level}&amount=${amount}&owner=${user.username}&character=2&note=Generated%20By%20${user.username}`;

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

	return (
		<section className="w-full py-12 md:py-16 lg:py-20">
			<div className="container px-4 md:px-6">
				<div className="mx-auto max-w-2xl space-y-4 text-center">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Generate License Keys</h2>
					<p className="text-gray-500 dark:text-gray-400 md:text-xl">
						Create custom license keys for your products or services.
					</p>
				</div>
				<div className="mx-auto mt-8 max-w-md space-y-4">
					<form className="grid gap-4" onSubmit={handleSubmit}>
						<div className="grid gap-2">
							<Label htmlFor="amount">Amount</Label>
							<Input
								id="amount"
								type="number"
								min="1"
								max="100"
								placeholder="Enter amount"
								value={amount}
								onChange={handleAmountChange}
								className="w-full"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="expiry">Expiry</Label>
							<Select value={expiry} onValueChange={(value) => setExpiry(value)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select expiry" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">1 day</SelectItem>
									<SelectItem value="7">7 days</SelectItem>
									<SelectItem value="30">30 days</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="game">Game</Label>
							<Select value={level} onValueChange={(value) => setLevel(value)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select expiry" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">Select An Option</SelectItem>
									<SelectItem value="1">Rainbow Lite</SelectItem>
									<SelectItem value="2">Rust</SelectItem>
									<SelectItem value="3">Fortnite</SelectItem>
									<SelectItem value="4">Apex Legends</SelectItem>
									<SelectItem value="5">Valorant</SelectItem>
									<SelectItem value="6">Counter-Strike 2</SelectItem>
									<SelectItem value="7">Rainbow Full</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button type="submit" className="w-full">
							Generate
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
};
