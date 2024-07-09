import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GenerateForm } from "../_components/generate-form";

export default async function Home() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'reseller') {
		return redirect('/')
	}

	return (
		<>
			<GenerateForm user={user} />
		</>
	)
}