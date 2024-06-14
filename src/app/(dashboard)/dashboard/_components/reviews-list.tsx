import { MoreHorizontal, Star } from "lucide-react"

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
	DropdownMenuTrigger
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
import { DropdownActions } from "./dropdown-actions"
import { User } from "@/payload-types"

export default async function ReviewsList() {
	const payload = await getPayloadClient()

	const { docs: reviews } = await payload.find({
		collection: "reviews",
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Reviews</CardTitle>
				<CardDescription>
					Manage your reviews and view their infos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Review</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{reviews.map(async (review, index) => {

							return (
								<TableRow key={index}>
									<TableCell className="hidden sm:table-cell">
										{review.description}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{review.rating}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{(review.user as User).username}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{(review.user as User).email}
									</TableCell>
									<TableCell className="font-medium">
										<Badge variant="outline" className={`${review.featured ? 'text-green-500' : 'text-red-500'}`}>{review.featured ? 'Featured' : 'Not Featured'}</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell">{format(parseISO(review.createdAt), 'dd/MM/yyyy hh:mm a')}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>

											{/* <DropdownActions customerId={reseller.id ? reseller.id : ''} customerUser={reseller.username} customerEmail={reseller.email} /> */}
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
					Showing <strong>1-10</strong> of <strong>{reviews ? reviews.length : '[N/A]'}</strong> reviews
				</div>
			</CardFooter>
		</Card>
	)
}
