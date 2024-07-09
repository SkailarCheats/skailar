'use client';

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PRODUCT_CATEGORY } from "@/config";
import { cn, formatPrice } from "@/lib/utils";
import { Order } from '@/payload-types';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export interface ProcessedProduct {
	id: string;
	name: string;
	category: "rainbow_six" | "cs2" | "eft" | "apex" | "rust" | "fortnite" | "valorant";
	price: number;
	orders: Order[];
}

export interface ProductsListClientProps {
	processedProducts: ProcessedProduct[];
}

export function ProductsListClient({ processedProducts }: ProductsListClientProps) {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('search') || '';
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState<ProcessedProduct | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [active, setActive] = useState<string>("");

	const productsPerPage = 10;

	const filteredProducts = processedProducts.filter(product =>
		searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
	);

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handleProductSelect = (product: ProcessedProduct) => {
		setSelectedProduct(product);
		setQuantity(1);
		setActive(product.id as string)
	};

	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newQuantity = parseInt(event.target.value, 10);
		setQuantity(newQuantity > 0 ? newQuantity : 1);
	};

	const totalCost = selectedProduct ? selectedProduct.price * quantity : 0;

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
							<TableHead>Name</TableHead>
							<TableHead className="hidden md:table-cell">Category</TableHead>
							<TableHead className="hidden md:table-cell">Price</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentProducts.map((product, index) => {
							const category = PRODUCT_CATEGORY.find((c) => c.value === product.category)?.label

							return (
								<TableRow key={index} className={cn(active === product.id && 'bg-muted/50 data-[state=selected]:bg-muted')} onClick={() => handleProductSelect(product)}>
									<TableCell className="font-medium">
										{product.name ? product.name : '[N/A]'}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{product.category ? category : '[N/A]'}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{product.price ? formatPrice(product.price) : '[N/A]'}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				{selectedProduct && (
					<div className="mt-4">
						<div className="flex justify-between mt-6 p-4 border rounded-lg items-center mb-4">
							<div>
								<label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground">Quantity</label>
								<Input
									id="quantity"
									type="number"
									value={quantity}
									onChange={handleQuantityChange}
								/>
							</div>
							<div>
								<div className="block text-sm font-medium text-muted-foreground">Total Cost</div>
								<div className="mt-1 text-lg font-semibold">{formatPrice(totalCost)}</div>
							</div>
							<div>
								<Button size="sm" variant="outline" onClick={() => alert(`Generating order for ${quantity} of ${selectedProduct.name}`)}>
									Generate
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter>
				<div className="flex justify-between items-center w-full">
					<div className="text-xs text-muted-foreground">
						Showing <strong>{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products
					</div>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</div>
			</CardFooter>
		</Card >
	);
}
