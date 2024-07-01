import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
	const nextCookies = await cookies();
	const { user: currentUser } = await getServerSideUser(nextCookies);

	if (!currentUser) {
		return redirect(`/login?origin=account`)
	}

	redirect(`/account/${currentUser.username}`);

}
