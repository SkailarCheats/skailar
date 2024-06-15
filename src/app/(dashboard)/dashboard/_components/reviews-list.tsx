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

	// Process the reviews data before rendering
	const processedReviews = reviews.map(review => {
		const user = review.user as User
		return {
			...review,
			username: user.username,
			email: user.email,
			createdAtFormatted: format(parseISO(review.createdAt), 'dd/MM/yyyy hh:mm a'),
			statusClass: review.featured ? 'text-green-500' : 'text-red-500',
			statusText: review.featured ? 'Featured' : 'Not Featured',
		}
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
							<TableHead className="hidden lg:table-cell">Review</TableHead>
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
						{processedReviews.map((review, index) => (
							<TableRow key={index}>
								<TableCell className="hidden lg:table-cell">
									{review.description}
								</TableCell>
								<TableCell>
									{review.rating}
								</TableCell>
								<TableCell>
									{review.username}
								</TableCell>
								<TableCell>
									{review.email}
								</TableCell>
								<TableCell className="font-medium">
									<Badge variant="outline" className={review.statusClass}>{review.statusText}</Badge>
								</TableCell>
								<TableCell>{review.createdAtFormatted}</TableCell>
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
						))}
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
