import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

import { getPayloadClient } from "@/get-payload";
import { formatPrice } from "@/lib/utils";

import { format, parseISO } from 'date-fns';
import { DropdownActions } from "./dropdown-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCT_CATEGORY } from "@/config";

export default async function ProductsList() {
	const payload = await getPayloadClient();

	const { docs: products } = await payload.find({
		collection: "products",
		depth: 2,
	});

	const productsWithOrders = await Promise.all(products.map(async (product) => {
		const { docs: orders } = await payload.find({
			collection: "orders",
			where: {
				products: {
					equals: {
						product,
					},
				},
			},
		});
		return { ...product, orders };
	}));

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
							<TableHead className="hidden md:table-cell">Category</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="hidden md:table-cell">Price</TableHead>
							<TableHead className="hidden md:table-cell">Created at</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{productsWithOrders.map((product, index) => {
							const { image } = product.images[0];

							let approved = "";

							switch (product.approvedForSale) {
								case "approved":
									approved = "text-green-500";
									break;
								case "pending":
									approved = "";
									break;
								case "denied":
									approved = "text-red-500";
									break;
								default:
									approved = "";
									break;
							}

							const category = PRODUCT_CATEGORY.find((c) => c.value === product.category)?.label

							return (
								<TableRow key={index}>
									<TableCell className="hidden sm:table-cell">
										{typeof image !== "string" && image.url ? (
											<Image
												alt="Product image"
												className="aspect-square rounded-md object-cover"
												height="64"
												src={image.url}
												width="64"
											/>
										) : (
											<Skeleton className="h-full w-full" />
										)}
									</TableCell>
									<TableCell className="font-medium">
										{product.name ? product.name : '[N/A]'}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{product.category ? category : '[N/A]'}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={`${approved}`}>
											{product.approvedForSale ? product.approvedForSale?.toUpperCase() : '[N/A]'}
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{product.price ? formatPrice(product.price) : '[N/A]'}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{product.createdAt ? format(parseISO(product.createdAt), "dd MMMM yyyy HH:MM") : '[N/A]'}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownActions productId={product.id ? product.id : ''} />
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>{products ? products.length : '[N/A]'}</strong> products
				</div>
			</CardFooter>
		</Card>
	);
}
