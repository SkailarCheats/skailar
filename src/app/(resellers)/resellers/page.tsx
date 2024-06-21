import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MainDashboard } from "./_components/main-dashboard";

export default async function Home() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'reseller') {
		return redirect('/verified-resellers')
	}

	return (
		<>
			<MainDashboard />
		</>
	)
}