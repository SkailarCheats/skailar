import { Reseller } from "@/payload-types"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FaBitcoin, FaCreditCard, FaDiscord, FaPaypal, FaTelegram } from "react-icons/fa"
import { IoMdCart } from "react-icons/io"
import { SiLitecoin } from "react-icons/si"
import { MaxWidthWrapper } from "./MaxWidthWrapper"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { buttonVariants } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export const ResellerDetails = ({ reseller }: { reseller: Reseller }) => {
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
		<MaxWidthWrapper>
			<div className="flex flex-col gap-6 p-6 md:p-10">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar className="h-12 w-12">
							<AvatarImage src={reseller.logo} />
							<AvatarFallback>{reseller.name.charAt(0)}</AvatarFallback>
						</Avatar>

						<div className="grid gap-1">
							<div className="text-xl font-bold">{reseller.name}</div>
							<div className="text-sm text-muted-foreground">@{reseller.username}</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{reseller.discord && (
							<Link target="_blank" href={`${reseller.discord}`}>
								<FaDiscord className="h-5 w-5" />
							</Link>
						)}
						{reseller.telegram && (
							<Link target="_blank" href={`${reseller.telegram}`}>
								<FaTelegram className="h-5 w-5" />
							</Link>
						)}
						<Link target="_blank" href={`${reseller.website}`}>
							<IoMdCart className="h-5 w-5" />
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Account Details</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-2">
							<div className="flex items-center justify-between">
								<div className="text-sm text-muted-foreground">Created At</div>
								<div className="text-sm">
									{new Date(reseller.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</div>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="text-sm text-muted-foreground">Payment Methods</div>
								<div className="flex items-center gap-2">
									{reseller.payments!.map(payment => (
										<>
											<TooltipProvider key={payment.id}>
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
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Links</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-2">
							<div className="flex items-center justify-between">
								<div className="text-sm text-muted-foreground">{reseller.discord ? 'Discord' : 'Telegram'}</div>
								<Link href={`${reseller.discord ? reseller.discord : reseller.telegram}`} target="_blank" className={buttonVariants({ variant: 'link' })} prefetch={false}>
									discord.gg/{reseller.name.toLowerCase()}
								</Link>
							</div>
							{reseller.website && (
								<>
									<Separator />
									<div className="flex items-center justify-between">
										<div className="text-sm text-muted-foreground">Website</div>
										<Link href={`${reseller.website}`} target="_blank" className={buttonVariants({ variant: 'link' })} prefetch={false}>
											{reseller.website}
										</Link>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</MaxWidthWrapper>
	)
}