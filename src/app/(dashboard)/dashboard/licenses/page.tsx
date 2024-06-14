import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LicensesList } from "../_components/licenses-list";

export default async function Home() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'admin') {
		return redirect('/')
	}

	const licenses = ['asd']

	return (
		<>
			{licenses.length <= 0 ? (
				<div
					className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
					x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">You have no licenses</h3>
						<p className="text-sm text-muted-foreground">You can start selling as soon as you add a product.</p>
					</div>
				</div>
			) : (
				<LicensesList />
			)}
		</>
	)
}