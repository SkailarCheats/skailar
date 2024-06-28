'use client';

import { useSearchParams } from 'next/navigation';
import { MoreHorizontal } from "lucide-react";
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

import { Product } from "@/payload-types";
import { DropdownActions } from "./dropdown-actions";

export interface ProcessedOrder {
	id: string;
	userEmail: string;
	_isPaid: boolean;
	products: Product[];
	licenseKey: string | null | undefined;
	createdAtFormatted: string;
	paidClass: string;
}

export interface OrdersListClientProps {
	processedOrders: ProcessedOrder[];
}

export function OrdersListClient({ processedOrders }: OrdersListClientProps) {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('search') || '';

	const filteredOrders = processedOrders.filter(order =>
		searchQuery ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) : true
	);

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
						{filteredOrders.map((order, index) => (
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
					Showing <strong>{filteredOrders.length}</strong> of <strong>{processedOrders.length}</strong> orders
				</div>
			</CardFooter>
		</Card>
	);
}