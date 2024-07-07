'use client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DropdownActions } from "./dropdown-actions";

export interface ProcessedCustomer {
	id: string;
	username: string;
	email: string;
	role: "customer" | "admin" | "reseller" | null | undefined;
	_verified: boolean | null | undefined;
	createdAtFormatted: string;
	roleClass: string;
	verifiedClass: string;
}

interface CustomerListClientProps {
	processedCustomers: ProcessedCustomer[];
}

export function CustomerListClient({ processedCustomers }: CustomerListClientProps) {
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)

	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('search') || '';

	const filteredCustomers = processedCustomers.filter(customer =>
		searchQuery ? customer.username.toLowerCase().includes(searchQuery.toLowerCase()) : true
	);

	const paginatedCustomers = filteredCustomers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

	const handleItemsPerPageChange = (value: string) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Customers</CardTitle>
				<CardDescription>
					Manage your customers and view their infos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Username</TableHead>
							<TableHead className="hidden lg:table-cell">Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Created at</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedCustomers.map((customer, index) => (
							<TableRow key={index}>
								<TableCell>
									{customer.username}
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									{customer.email}
								</TableCell>
								<TableCell className="font-medium">
									<Badge variant="outline" className={customer.verifiedClass}>{customer._verified ? 'Verified' : 'Not Verified'}</Badge>
								</TableCell>
								<TableCell>
									<Badge variant="outline" className={customer.roleClass}>{customer.role?.toUpperCase()}</Badge>
								</TableCell>
								<TableCell>{customer.createdAtFormatted}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button aria-haspopup="true" size="icon" variant="ghost">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DropdownMenuTrigger>

										<DropdownActions customerId={customer.id} customerUser={customer.username} customerEmail={customer.email} customerRole={customer.role as string} customerVerified={customer._verified as boolean} />
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between items-center w-full">
					<div className="text-xs text-muted-foreground">
						Showing <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</strong> of <strong>{filteredCustomers.length}</strong> customers
					</div>
					<div className="flex items-center gap-2">
						<Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
							<SelectTrigger className="w-[70px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}