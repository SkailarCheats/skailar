'use client';

import AllReviews from "@/components/all-reviews";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product, User } from "@/payload-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
	rating: z.number().min(1).max(5),
	description: z.string().min(10).max(500),
});

type FormValues = z.infer<typeof formSchema>;

interface Review {
	id: string;
	user: string | User | null;
	rating: number;
	createdAt: string;
	description: string;
	featured: boolean | null | undefined;
}

interface Order {
	products: (string | Product)[];
}

interface ReviewsPageClientProps {
	initialReviews: Review[];
	initialOrders: Order[];
	initialUser: User | null;
	products: (string | Product)[];
}

const ReviewsPageClient: React.FC<ReviewsPageClientProps> = ({ initialReviews, initialOrders, initialUser, products }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [reviews, setReviews] = useState(initialReviews);
	const [orders] = useState(initialOrders);
	const [user] = useState(initialUser);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			rating: 5,
			description: "",
		},
	});

	const userReviews = reviews.filter(review => (review.user as User)?.id === user?.id);
	const userOrdersCount = orders.length;
	const userReviewsCount = userReviews.length;
	const canCreateReview = userOrdersCount > userReviewsCount;

	const onSubmit = (values: FormValues) => {
		const newReview: Review = {
			id: Date.now().toString(),
			user: user,
			rating: values.rating,
			createdAt: new Date().toISOString(),
			description: values.description,
			featured: true
		};

		setReviews(prevReviews => [...prevReviews, newReview]);
		setIsOpen(false);
		form.reset();

		fetch('/api/reviews', {
			method: 'POST',
			body: JSON.stringify(newReview),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to create review');
				}
				toast.success('Review Created Successfully');
			})
			.catch(error => {
				toast.error('Error creating the Review');
				// Remove the review from state if the creation fails
				setReviews(prevReviews => prevReviews.filter(r => r.id !== newReview.id));
			});
	};

	return (
		<section className="bg-background text-foreground">
			<div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
				<div className="mb-8 flex justify-between">
					<h2 className="text-3xl font-bold md:text-4xl">Reviews</h2>
					{canCreateReview && (
						<Dialog open={isOpen} onOpenChange={setIsOpen}>
							<DialogTrigger asChild>
								<Button variant="outline" className="gap-1" onClick={() => setIsOpen(true)}>
									<Plus className="h-5 w-5" />
									Create
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Create a Review</DialogTitle>
								</DialogHeader>
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
										<FormField
											control={form.control}
											name="rating"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Rating</FormLabel>
													<FormControl>
														<Input type="number" {...field} min={1} max={5} onChange={e => field.onChange(Number(e.target.value))} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Review</FormLabel>
													<FormControl>
														<Textarea {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button type="submit">Submit Review</Button>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
					)}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{reviews.map(review => (
						<AllReviews
							key={review.id}
							rating={review.rating}
							date={review.createdAt}
							description={review.description}
							products={products}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default ReviewsPageClient;
