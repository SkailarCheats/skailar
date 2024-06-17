"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { User, UserDetail } from "@/payload-types";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export const LoginLogs = ({ user }: { user: User }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const sortedDetails = [...(user.details as UserDetail[])].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	const totalPages = Math.ceil(sortedDetails.length / itemsPerPage);

	const currentDetails = sortedDetails.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const goToNextPage = () => {
		setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
	};

	const goToPreviousPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	return (
		<>
			<CardContent className="grid gap-4">
				{currentDetails.map((detail, index) => (
					<div className="flex items-center justify-between" key={index}>
						<div>
							<p className="text-sm font-medium">New Login</p>
							<span className="text-sm text-muted-foreground dark:text-gray-400">
								Logged in from{' '}
								<Link href={`https://maps.google.com/?q=${detail.loc}`} target="_blank" className={buttonVariants({ variant: 'link', size: 'custom' })}>
									{detail.region && `${detail.region},`} {detail.country}
								</Link>
								<div className="text-sm text-gray-400">IP: {detail.ip}</div>
							</span>
						</div>
						<div className="text-sm text-muted-foreground dark:text-gray-400">
							{formatDistanceToNow(parseISO(detail.createdAt), { addSuffix: true })}
						</div>
					</div>
				))}
			</CardContent>
			<CardFooter>
				<div className="flex justify-between items-center w-full">
					<div className="text-xs text-muted-foreground">
						Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, sortedDetails.length)}</strong> of <strong>{sortedDetails.length}</strong> logins
					</div>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</div>
			</CardFooter>
		</>
	)
}