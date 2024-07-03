import { ResellerDetails } from "@/components/reseller-details";
import { getPayloadClient } from "@/get-payload";
import { notFound } from "next/navigation";

interface PageProps {
	params: {
		name: string;
	}
}

export default async function Page({ params }: PageProps) {
	const { name } = params;

	const payload = await getPayloadClient();
	const { docs: resellers } = await payload.find({
		collection: "resellers",
		where: {
			name: {
				equals: name
			}
		}
	})

	const [reseller] = resellers;

	if (!reseller) return notFound()
	if (reseller.name !== name) return notFound()

	return (
		<ResellerDetails reseller={reseller} />
	)
}