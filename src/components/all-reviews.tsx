import { Card } from "@/components/ui/card";
import { getPayloadClient } from "@/get-payload";
import { Order, User } from "@/payload-types";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Star } from "lucide-react";
import { Badge } from "./ui/badge";

interface AllReviewsProps {
	rating: number;
	date: string;
	description: string;
	user: string | User | null;
}

export default async function AllReviews({ date, description, rating, user }: AllReviewsProps) {
	const userId = user && typeof user === 'object' ? user.id : '';

	const payload = await getPayloadClient();
	const { docs: orders } = await payload.find({
		collection: 'orders',
		where: {
			and: [
				{
					user: {
						equals: userId,
					},
				},
				{
					_isPaid: {
						equals: true,
					},
				},
			],
		},
	});

	const MAX_RATING = 5

	return (
		<Card className="w-full max-w-md p-6 bg-white dark:bg-gray-950 rounded-lg shadow-lg flex flex-col justify-between">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-1.5">
					{Array.from({ length: MAX_RATING }, (_, index) => (
						<Star
							key={index}
							className={`h-5 w-5 ${index < rating ? 'text-purple-500 fill-purple-500' : 'text-purple-500'}`}
						/>
					))}
				</div>
				<time dateTime={date} className="text-muted-foreground text-sm">
					{formatDistanceToNow(parseISO(date), { addSuffix: true }) === 'less than a minute ago' ? 'a minute ago' : formatDistanceToNow(parseISO(date), { addSuffix: true })}
				</time>
			</div>
			<p className="mt-4 text-gray-700 dark:text-gray-300">
				{description}
			</p>
			<div className="flex justify-end mt-4">
				<div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
					<Badge variant="outline" className="gap-1.5 text-green-500">
						<CheckIcon className="w-4 h-4" />
						Verified Customer
					</Badge>
				</div>
			</div>
		</Card>
	);
}

function CheckIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}

function StarIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill=""
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	);
}
