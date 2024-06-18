"use client";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
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

import { formatDate, formatExpires } from "@/lib/utils";
import { useEffect, useState } from "react";
import { User } from "@/payload-types";

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


export const LicensesList = ({ user, active }: { user: User, active: boolean }) => {
	const ITEMS_PER_PAGE = active ? 5 : 10;
	const [keys, setKeys] = useState<Keys[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('/api/all-licenses');
				const data: ApiResponse = await res.json();

				if (data.success) {
					setKeys(data.keys);
				} else {
					setError('Error');
				}
			} catch (err) {
				setError('Internal Error');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredKeys = active
		? keys.filter(key => key.genby === user.username && key.status === 'Used')
		: keys.filter(key => key.genby === user.username && key.status === 'Not Used');

	const totalPages = Math.ceil(filteredKeys.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedKeys = filteredKeys.slice(startIndex, endIndex);

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

	const handleDownloadTxt = () => {
		const keysToDownload = filteredKeys.map(key => key.key).join('\n');
		const blob = new Blob([keysToDownload], { type: 'text/plain;charset=utf-8' });
		saveAs(blob, 'licenses.txt');
	};

	const handleDownloadJson = () => {
		const keysToDownload = JSON.stringify(filteredKeys, null, 2);
		const blob = new Blob([keysToDownload], { type: 'application/json;charset=utf-8' });
		saveAs(blob, 'licenses.json');
	};

	return (
		<Card>
			<CardHeader className="flex justify-between">
				<div className="flex flex-col">
					<CardTitle>{active ? 'Active Licenses' : 'Licenses'}</CardTitle>
					<CardDescription>
						Manage your {active ? 'active licenses' : 'licenses'}.
					</CardDescription>
				</div>
				{!active && (
					<div className="flex ml-auto">
						<Button onClick={handleDownloadTxt} variant="outline" size="sm" className="mr-2">
							Save as TXT
						</Button>
						<Button onClick={handleDownloadJson} variant="outline" size="sm">
							Save as JSON
						</Button>
					</div>
				)}
			</CardHeader>
			<CardContent>
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
							let game = '';
							let status = '';

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
								case '10':
									game = 'FULL ACCESS';
									break;
							}

							switch (key.status) {
								case 'Used':
									status = 'text-blue-500';
									break;
								case 'Not Used':
									status = 'text-green-500';
									break;
								case 'Banned':
									status = 'text-red-500';
									break;
							}

							return (
								<TableRow key={key.id}>
									<TableCell className="hidden md:table-cell">{key.key ? key.key : '[N/A]'}</TableCell>
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
											{/* <DropdownActions license={key} /> */}
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between items-center w-full">
					<div className="text-xs text-muted-foreground">
						Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredKeys.length)}</strong> of <strong>{filteredKeys.length}</strong> products
					</div>
					<div className="flex gap-2">
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
	);
}
