import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'reseller') {
		return redirect('/')
	}

	return (
		<>
			<section className="bg-background text-foreground">
				<div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
					<div className="mb-8 text-center">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Coming Soon</h2>
					</div>
				</div>
			</section>
		</>
	)
}