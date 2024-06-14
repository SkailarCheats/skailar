import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CustomersList from "../_components/customers-list";
import ResellersList from "../_components/resellers-list";

export default async function Home() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'admin') {
		return redirect('/')
	}

	const payload = await getPayloadClient()

	const { docs: resellers } = await payload.find({
		collection: "users",
		where: {
			role: {
				equals: 'reseller'
			}
		}
	})

	return (
		<>
			{resellers.length <= 0 ? (
				<div
					className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
					x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">You have no Resellers</h3>
					</div>
				</div>
			) : (
				<ResellersList />
			)}
		</>
	)
}