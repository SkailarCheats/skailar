import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PersonalInfos } from "../_components/personal-infos";

interface PageProps {
	params: {
		username: string;
	};
}

export default async function Home({ params }: PageProps) {
	const { username } = params;

	const nextCookies = await cookies()
	const { user: currentUser } = await getServerSideUser(nextCookies)

	if (!currentUser) return redirect(`/login?origin=account/${username}`)

	if (currentUser.username !== username) return notFound()

	const payload = await getPayloadClient();
	const { docs: users } = await payload.find({
		collection: "users",
		where: {
			username: {
				equals: currentUser.username,
			}
		}
	});

	const [user] = users;

	if (currentUser?.username !== username) return notFound();

	return (
		<PersonalInfos user={currentUser!} />
	);
}
