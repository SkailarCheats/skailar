import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import { getPayloadClient } from "@/get-payload"

import { format, parseISO } from 'date-fns'
import { Product, User } from "@/payload-types"

import copy from "copy-to-clipboard";
import { DropdownActions } from "./dropdown-actions"

export default async function OrdersList() {
	const payload = await getPayloadClient()

	const { docs: orders } = await payload.find({
		collection: "orders",
		depth: 2,
		where: {
			_isPaid: {
				equals: true
			}
		}
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Orders</CardTitle>
				<CardDescription>
					Manage your orders.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead className="hidden md:table-cell">
								User
							</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="hidden md:table-cell">
								Product
							</TableHead>
							<TableHead>License</TableHead>
							<TableHead className="hidden md:table-cell">Created at</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map(async (order, index) => {
							let paid = '';

							switch (order._isPaid) {
								case true:
									paid = 'text-green-500'
									break;
								case false:
									paid = 'text-red-500'
									break;
								default:
									paid = ''
									break;
							}

							const copyToClipboard = (text: string) => {
								copy(text);
								console.log(`Copied to clipboard: ${text}`);
							};

							return (
								<TableRow key={index}>
									<TableCell className="font-medium">
										{order.id}
									</TableCell>
									<TableCell className="hidden md:table-cell">{(order.user as User).email}</TableCell>
									<TableCell>
										<Badge variant="outline" className={`${paid}`}>{order._isPaid ? 'Paid' : 'Not Paid'}</Badge>
									</TableCell>

									{order.products.map((product, index) => (
										<TableCell key={index} className="hidden md:table-cell">{(product as Product).name}</TableCell>
									))}

									<TableCell className="hidden md:table-cell">{order.licenseKey ? order.licenseKey : '[N/A]'}</TableCell>
									<TableCell className="hidden md:table-cell">
										{format(parseISO(order.createdAt), 'dd MMMM yyyy hh:mm a')}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownActions orderId={order.id} userEmail={(order.user as User).email} licenseKey={order.licenseKey ? order.licenseKey : '[N/A]'} />
										</DropdownMenu>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>24</strong> products
				</div>
			</CardFooter>
		</Card>
	)
}
