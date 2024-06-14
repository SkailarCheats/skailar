import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResellersList from "../_components/resellers-list";
import ReviewsList from "../_components/reviews-list";

export default async function Home() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'admin') {
		return redirect('/')
	}

	const payload = await getPayloadClient()

	const { docs: reviews } = await payload.find({
		collection: "reviews",
	})

	return (
		<>
			{reviews.length <= 0 ? (
				<div
					className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
					x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">You have no Reviews</h3>
					</div>
				</div>
			) : (
				<ReviewsList />
			)}
		</>
	)
}