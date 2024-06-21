import Link from "next/link";
import { Separator } from "./ui/separator";

import { Reseller } from "@/payload-types";
import { FaBitcoin, FaCreditCard, FaPaypal } from "react-icons/fa";
import { SiLitecoin } from "react-icons/si";
import Image from "next/image";

export const AllResellers = ({ resellers }: { resellers: Reseller[] }) => {
	return (
		<>
			{resellers.map((reseller, index) => (
				<div key={index} className="flex flex-col items-center gap-4 rounded-lg border bg-white dark:bg-gray-950 p-6 shadow-lg">
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
								{payment.method === 'PayPal' && <FaPaypal className="h-5 w-5 text-white" />}
								{payment.method === 'Bitcoin' && <FaBitcoin className="h-5 w-5 text-white" />}
								{payment.method === 'Litecoin' && <SiLitecoin className="h-5 w-5 text-white" />}
								{payment.method === 'Credit Card' && <FaCreditCard className="h-5 w-5 text-white" />}
							</>
						))}
					</div>
				</div>
			))}
		</>
	)
}