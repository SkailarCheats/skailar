import React from "react";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { OrderList } from "../../_components/orders-list";

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

	if (users.length === 0) {
		return notFound();
	}

	const [user] = users;

	const { docs: orders } = await payload.find({
		collection: 'orders',
		where: {
			user: {
				equals: user.id
			}
		}
	})

	const nextCookies = await cookies();
	const { user: currentUser } = await getServerSideUser(nextCookies);

	if (!user || currentUser?.username !== username) {
		return notFound();
	}

	return (
		<>
			<OrderList user={user} orders={orders} />
		</>
	);
}
