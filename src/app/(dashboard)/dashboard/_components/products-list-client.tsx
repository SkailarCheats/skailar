'use client';

import { useSearchParams } from 'next/navigation';
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
import { formatPrice } from "@/lib/utils";
import { DropdownActions } from "./dropdown-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCT_CATEGORY } from "@/config";
import { Order } from '@/payload-types';

export interface ProcessedProduct {
	id: string;
	name: string;
	category: "rainbow_six" | "cs2" | "eft" | "apex" | "rust" | "fortnite" | "valorant";
	approvedForSale: "pending" | "approved" | "denied" | undefined;
	price: number;
	createdAt: string;
	images: { image: { url: string } }[];
	orders: Order[];
}

export interface ProductsListClientProps {
	processedProducts: ProcessedProduct[];
}

export function ProductsListClient({ processedProducts }: ProductsListClientProps) {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('search') || '';

	const filteredProducts = processedProducts.filter(product =>
		searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
	);

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
						{filteredProducts.map((product, index) => {
							const { image } = product.images[0];

							let approved = "";

							switch (product.approvedForSale) {
								case "approved":
									approved = "text-green-500";
									break;
								case "pending":
									approved = "text-yellow-500";
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
										{product.createdAt}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownActions productId={product.id} productStatus={product.approvedForSale} />
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
					Showing <strong>{filteredProducts.length}</strong> of <strong>{processedProducts.length}</strong> products
				</div>
			</CardFooter>
		</Card>
	);
}