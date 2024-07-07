import { getPayloadClient } from "@/get-payload"
import { format, parseISO } from 'date-fns'
import { CustomerListClient } from './customers-list-client'

export default async function CustomersList() {
	const payload = await getPayloadClient()

	const { docs: customers } = await payload.find({
		collection: "users",
		where: {
			role: {
				equals: 'customer'
			}
		},
		limit: 0
	})

	const processedCustomers = customers.map(customer => {
		let roleClass = '';
		let verifiedClass = '';

		switch (customer.role) {
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

		switch (customer._verified) {
			case true:
				verifiedClass = 'text-green-500'
				break;
			case false:
				verifiedClass = 'text-red-500'
		}

		return {
			id: customer.id,
			username: customer.username,
			email: customer.email,
			role: customer.role,
			_verified: customer._verified,
			createdAtFormatted: format(parseISO(customer.createdAt), 'dd/MM/yyyy hh:mm a'),
			roleClass,
			verifiedClass,
		};
	});

	return <CustomerListClient processedCustomers={processedCustomers} />;
}