import { getPayloadClient } from "@/get-payload"
import { format, parseISO } from 'date-fns'
import { AdminsListClient } from "./admins-list-client";

export default async function CustomersList() {
	const payload = await getPayloadClient()

	const { docs: admins } = await payload.find({
		collection: "users",
		where: {
			role: {
				equals: 'admin'
			}
		},
		limit: 0
	})

	const processedAdmins = admins.map(admin => {
		let roleClass = '';
		let verifiedClass = '';

		switch (admin.role) {
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

		switch (admin._verified) {
			case true:
				verifiedClass = 'text-green-500'
				break;
			case false:
				verifiedClass = 'text-red-500'
		}

		return {
			id: admin.id,
			username: admin.username,
			email: admin.email,
			role: admin.role,
			_verified: admin._verified,
			createdAtFormatted: format(parseISO(admin.createdAt), 'dd/MM/yyyy hh:mm a'),
			roleClass,
			verifiedClass,
		};
	});

	return <AdminsListClient processedAdmins={processedAdmins} />;
}