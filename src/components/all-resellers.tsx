import Link from "next/link";
import { Separator } from "./ui/separator";

import { Reseller } from "@/payload-types";
import { FaBitcoin, FaCreditCard, FaPaypal } from "react-icons/fa";
import { SiLitecoin } from "react-icons/si";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const AllResellers = ({ resellers }: { resellers: Reseller[] }) => {
	const renderIcon = (method: any) => {
		switch (method) {
			case 'PayPal':
				return <FaPaypal className="h-5 w-5 text-white" />;
			case 'Bitcoin':
				return <FaBitcoin className="h-5 w-5 text-white" />;
			case 'Litecoin':
				return <SiLitecoin className="h-5 w-5 text-white" />;
			case 'Credit Card':
				return <FaCreditCard className="h-5 w-5 text-white" />;
			default:
				return null;
		}
	};

	return (
		<>
			{resellers.map((reseller, index) => (
				<Link key={index} href={reseller.name}>
					<div className="flex flex-col items-center gap-4 rounded-lg border bg-white dark:bg-gray-950 p-6 shadow-lg">
						<div className="flex h-24 w-24 items-center justify-center rounded-full">
							<Image src={reseller.logo} alt={reseller.name} width={96} height={96} className="h-20 w-20" />
						</div>
						<h3 className="text-lg font-semibold">{reseller.name}</h3>
						<div className="flex items-center gap-2">
							{reseller.discord && (
								<Link href={reseller.discord} target="_blank" className="text-primary hover:underline" prefetch={false}>
									Discord
								</Link>
							)}
							{reseller.telegram && (
								<Link href={reseller.telegram} target="_blank" className="text-primary hover:underline" prefetch={false}>
									Telegram
								</Link>
							)}
							{reseller.telegram || reseller.discord && (
								<Separator orientation="vertical" className="h-4" />
							)}
							<Link href={reseller.website} target="_blank" className="text-primary hover:underline" prefetch={false}>
								Website
							</Link>
						</div>
						<div className="flex items-center gap-2">
							{reseller.payments!.map(payment => (
								<>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												{renderIcon(payment.method)}
											</TooltipTrigger>
											<TooltipContent>
												<p>{payment.method}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</>
							))}
						</div>
					</div>
				</Link>
			))}
		</>
	)
}