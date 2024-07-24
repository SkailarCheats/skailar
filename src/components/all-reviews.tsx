import { Card } from "@/components/ui/card";
import { Product } from "@/payload-types";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { CheckIcon, Star } from "lucide-react";
import { Badge } from "./ui/badge";

interface AllReviewsProps {
	rating: number;
	date: string;
	description: string;
	products: (string | Product)[]
}

export default async function AllReviews({ date, description, rating, products }: AllReviewsProps) {
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

			<div className="mt-2">
				{products.map((product, index) => (
					<span key={index} className="text-sm text-gray-500 dark:text-gray-400">
						{typeof product === 'string' ? product : product.name}
						{index !== products.length - 1 && ', '}
					</span>
				))}
			</div>

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
