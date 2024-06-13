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

export default async function OrdersList() {
	const payload = await getPayloadClient()

	const { docs: orders } = await payload.find({
		collection: "orders",
		depth: 2
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
							<TableHead>Status</TableHead>
							<TableHead>License</TableHead>
							<TableHead className="hidden md:table-cell">
								Total Sales
							</TableHead>
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

							return (
								<TableRow key={index}>
									<TableCell className="font-medium">
										{order.id}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={`${paid}`}>{order._isPaid ? 'Paid' : 'Not Paid'}</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">{order.licenseKey}</TableCell>
									<TableCell className="hidden md:table-cell">{orders.length}</TableCell>
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
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem>Delete</DropdownMenuItem>
											</DropdownMenuContent>
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
					Showing <strong>1-10</strong> of <strong>{orders.length}</strong> products
				</div>
			</CardFooter>
		</Card>
	)
}
