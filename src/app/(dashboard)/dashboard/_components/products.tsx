import Image from "next/image"
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
import { formatPrice } from "@/lib/utils"

import { format, parseISO } from 'date-fns';

export default async function Products() {
	const payload = await getPayloadClient()

	const { docs: products } = await payload.find({
		collection: "products",
		depth: 2
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Products</CardTitle>
				<CardDescription>
					Manage your products and view their sales performance.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="hidden w-[100px] sm:table-cell">
								<span className="sr-only">Image</span>
							</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="hidden md:table-cell">Price</TableHead>
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
						{products.map(async (product, index) => {
							const { image } = product.images[0]

							let approved = ''

							switch (product.approvedForSale) {
								case 'approved':
									approved = 'text-green-500'
									break;
								case 'pending':
									approved = ''
									break;
								case 'denied':
									approved = 'text-red-500'
									break;
								default:
									approved = ''
									break;
							}

							const { docs: orders } = await payload.find({
								collection: 'orders',
								where: {
									products: {
										equals: {
											product
										}
									}
								}
							})

							return (
								<TableRow key={index}>
									<TableCell className="hidden sm:table-cell">
										{typeof image !== 'string' && image.url && (
											<Image
												alt="Product image"
												className="aspect-square rounded-md object-cover"
												height="64"
												src={image.url}
												width="64"
											/>
										)}
									</TableCell>
									<TableCell className="font-medium">
										{product.name}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={`${approved}`}>{product.approvedForSale?.toUpperCase()}</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">{formatPrice(product.price)}</TableCell>
									<TableCell className="hidden md:table-cell">{orders.length}</TableCell> {/* TODO: Make sure is correct */}
									<TableCell className="hidden md:table-cell">
										{format(parseISO(product.createdAt), 'dd MMMM yyyy hh:mm a')}
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
					Showing <strong>1-10</strong> of <strong>32</strong> products
				</div>
			</CardFooter>
		</Card>
	)
}
