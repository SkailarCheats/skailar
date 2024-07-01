import React from "react";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { PersonalInfos } from "../../_components/personal-infos";
import { DeleteUser } from "../../_components/delete-user";

interface PageProps {
	params: {
		username: string;
	};
}

export default async function Home({ params }: PageProps) {
	const { username } = params;

	const payload = await getPayloadClient();
	const { docs: users } = await payload.find({
		collection: "users",
		where: {
			username: {
				equals: username,
			}
		}
	});

	const [user] = users;

	const nextCookies = await cookies()
	const { user: currentUser } = await getServerSideUser(nextCookies)

	if (!user || currentUser?.username !== username) return notFound();

	return (
		<>
			<DeleteUser user={user} />
		</>
	);
}