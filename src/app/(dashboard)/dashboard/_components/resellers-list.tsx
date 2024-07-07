import { getPayloadClient } from "@/get-payload"
import { format, parseISO } from 'date-fns'
import { ResellersListClient } from './resellers-list-client'

export default async function ResellersList() {
	const payload = await getPayloadClient()

	const { docs: resellers } = await payload.find({
		collection: "users",
		where: {
			role: {
				equals: 'reseller'
			}
		},
		limit: 0
	})

	const processedResellers = resellers.map(reseller => {
		let roleClass = '';
		let verifiedClass = '';

		switch (reseller.role) {
			case 'admin':
				roleClass = 'text-red-500'
				break;
			case 'reseller':
				roleClass = 'text-yellow-500'
				break;
			case 'customer':
				roleClass = 'text-muted-foreground'
				break;
			default:
				roleClass = ''
				break;
		}

		switch (reseller._verified) {
			case true:
				verifiedClass = 'text-green-500'
				break;
			case false:
				verifiedClass = 'text-red-500'
		}

		return {
			id: reseller.id,
			username: reseller.username,
			email: reseller.email,
			role: reseller.role,
			_verified: reseller._verified,
			createdAtFormatted: format(parseISO(reseller.createdAt), 'dd/MM/yyyy hh:mm a'),
			roleClass,
			verifiedClass,
			resellerStore: reseller.resellerStore,
		};
	});

	return <ResellersListClient processedResellers={processedResellers} />;
}