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
	DropdownMenuTrigger
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
import { Product, User } from "@/payload-types"
import { format, parseISO } from 'date-fns'
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

	const processedOrders = orders.map(order => {
		const user = order.user as User
		const products = order.products.map(product => product as Product)
		const paidClass = order._isPaid ? 'text-green-500' : 'text-red-500'
		const createdAtFormatted = format(parseISO(order.createdAt), 'dd MMMM yyyy hh:mm a')

		return {
			...order,
			userEmail: user.email,
			products,
			paidClass,
			createdAtFormatted
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
							<TableHead className="hidden lg:table-cell">ID</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Product</TableHead>
							<TableHead className="hidden lg:table-cell">License</TableHead>
							<TableHead>Created at</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{processedOrders.map((order, index) => (
							<TableRow key={index}>
								<TableCell className="hidden lg:table-cell">
									{order.id ? order.id : '[N/A]'}
								</TableCell>
								<TableCell>{order.userEmail ? order.userEmail : '[N/A]'}</TableCell>
								<TableCell>
									<Badge variant="outline" className={order.paidClass}>{order._isPaid ? 'Paid' : 'Not Paid'}</Badge>
								</TableCell>
								<TableCell>
									{order.products.map((product, index) => (
										<div key={index}>{product.name ? product.name : '[N/A]'}</div>
									))}
								</TableCell>
								<TableCell className="hidden lg:table-cell">{order.licenseKey ? order.licenseKey : '[N/A]'}</TableCell>
								<TableCell>
									{order.createdAtFormatted}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button aria-haspopup="true" size="icon" variant="ghost">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownActions orderId={order.id} userEmail={order.userEmail} licenseKey={order.licenseKey ? order.licenseKey : '[N/A]'} />
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>{orders ? orders.length : '[N/A]'}</strong> products
				</div>
			</CardFooter>
		</Card>
	)
}
