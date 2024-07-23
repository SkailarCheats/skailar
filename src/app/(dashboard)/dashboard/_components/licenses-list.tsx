"use client";

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

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatExpires } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DropdownActions } from "./dropdown-actions";
import { getSellerBaseURL } from "@/lib/urls";

import { saveAs } from "file-saver";
import DownloadButtons from "@/components/download-buttons";

export interface Keys {
	id: string;
	key: string;
	note: string | null;
	expires: string;
	status: string;
	level: string;
	genby: string;
	gendate: string;
	usedon: string;
	usedby: string;
	banned: string | null;
}

export interface ApiResponse {
	success: boolean;
	keys: Keys[];
}

const levelLabels = {
	All: "Filter by Level",
	1: "Rainbow Lite",
	2: "Rust",
	3: "Fortnite",
	4: "Apex Legends",
	5: "Valorant",
	6: "Counter-Strike 2",
	7: "Rainbow Full",
};

const statusLabels = {
	All: "Filter by Status",
	"Not Used": "Not Used",
	Used: "Used",
	Banned: "Banned",
};

const expirationLabels = {
	All: "Filter by Expiration",
	"86400": "1 Day",
	"259200": "3 Days",
	"604800": "1 Week",
	"2592000": "1 Month",
};

export const LicensesList = () => {
	const [keys, setKeys] = useState<Keys[]>([])
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("All");
	const [levelFilter, setLevelFilter] = useState<string>("All");
	const [genbyFilter, setGenbyFilter] = useState<string>("");
	const [expirationFilter, setExpirationFilter] = useState<string>("All");
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`${getSellerBaseURL}&type=fetchallkeys&format=json`)
				const data: ApiResponse = await res.json();

				if (data.success) {
					setKeys(data.keys)
				} else {
					setError('Error')
				}
			} catch (err) {
				setError('Internal Error')
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const filteredKeys = keys.filter((key) => {
		return (
			(key.key.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(statusFilter === "All" || key.status === statusFilter) &&
			(levelFilter === "All" || key.level === levelFilter) &&
			(genbyFilter === "" || key.genby.includes(genbyFilter)) &&
			(expirationFilter === "All" || key.expires === expirationFilter) &&
			(key.genby !== 'SkailarResell')
		);
	});

	const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedKeys = filteredKeys.slice(startIndex, endIndex);

	const handleItemsPerPageChange = (value: string) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col">
					<CardTitle>Licenses</CardTitle>
					<CardDescription>
						Manage your licenses.
					</CardDescription>
				</div>
				<DownloadButtons filteredKeys={filteredKeys} />
			</CardHeader>
			<CardContent>
				<div className="flex flex-col md:flex-row gap-4 mb-4">
					<Input
						placeholder="Search by key"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Select onValueChange={(value) => setStatusFilter(value)} defaultValue="All">
						<SelectTrigger>{statusLabels[statusFilter as keyof typeof statusLabels]}</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All</SelectItem>
							<SelectItem value="Not Used">Not Used</SelectItem>
							<SelectItem value="Used">Used</SelectItem>
							<SelectItem value="Banned">Banned</SelectItem>
						</SelectContent>
					</Select>
					<Select onValueChange={(value) => setLevelFilter(value)} defaultValue="All">
						<SelectTrigger>{levelLabels[levelFilter as keyof typeof levelLabels]}</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All</SelectItem>
							<SelectItem value="1">Rainbow Lite</SelectItem>
							<SelectItem value="2">Rust</SelectItem>
							<SelectItem value="3">Fortnite</SelectItem>
							<SelectItem value="4">Apex Legends</SelectItem>
							<SelectItem value="5">Valorant</SelectItem>
							<SelectItem value="6">Counter-Strike 2</SelectItem>
							<SelectItem value="7">Rainbow Full</SelectItem>
						</SelectContent>
					</Select>
					<Input
						placeholder="Filter by Created By"
						value={genbyFilter}
						onChange={(e) => setGenbyFilter(e.target.value)}
					/>
					<Select onValueChange={(value) => setExpirationFilter(value)} defaultValue="All">
						<SelectTrigger>{expirationLabels[expirationFilter as keyof typeof expirationLabels]}</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All</SelectItem>
							<SelectItem value="86400">1 Day</SelectItem>
							<SelectItem value="259200">3 Days</SelectItem>
							<SelectItem value="604800">1 Week</SelectItem>
							<SelectItem value="2592000">1 Month</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="hidden md:table-cell">Key</TableHead>
							<TableHead>Expires</TableHead>
							<TableHead className="hidden md:table-cell">Status</TableHead>
							<TableHead className="hidden md:table-cell">Created By</TableHead>
							<TableHead>Game</TableHead>
							<TableHead className="hidden md:table-cell">Used By</TableHead>
							<TableHead className="hidden md:table-cell">Used On</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedKeys.map((key) => {
							let game = ''
							let status = ''

							switch (key.level) {
								case '1':
									game = 'Rainbow Lite';
									break;
								case '2':
									game = 'Rust';
									break;
								case '3':
									game = 'Fortnite';
									break;
								case '4':
									game = 'Apex Legends';
									break;
								case '5':
									game = 'Valorant';
									break;
								case '6':
									game = 'Counter-Strike 2';
									break;
								case '7':
									game = 'Rainbow Full';
									break;
							}

							switch (key.status) {
								case 'Used':
									status = 'text-blue-500'
									break;
								case 'Not Used':
									status = 'text-green-500'
									break;
								case 'Banned':
									status = 'text-red-500'
									break
							}

							return (
								<TableRow key={key.id}>
									<TableCell className="hidden md:table-cell">
										<p className="blur hover:blur-none">
											{key.key ? key.key : '[N/A]'}
										</p>
									</TableCell>
									<TableCell className="hidden md:table-cell">{key.expires ? formatExpires(key.expires) : '[N/A]'}</TableCell>
									<TableCell>
										<Badge variant="outline" className={status}>{key.status}</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										<Badge variant='outline' className="text-purple-500">{key.genby ? key.genby : '[N/A]'}</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">{key.level ? game : '[N/A]'}</TableCell>
									<TableCell className="hidden md:table-cell">
										<Badge variant="outline" className={`${key.usedby ? 'text-purple-500' : 'text-green-500'}`}>
											{key.usedby ? key.usedby : 'Not Used'}
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{key.usedon ? formatDate(key.usedon) : '[N/A]'}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownActions license={key} />
										</DropdownMenu>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between items-center w-full">
					<div className="text-xs text-muted-foreground">
						Showing <strong>{startIndex + 1}-{Math.min(endIndex, keys.length)}</strong> of <strong>{keys.length}</strong> products
					</div>
					<div className="flex gap-2">
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
						<Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}