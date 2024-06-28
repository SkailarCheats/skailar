import { getPayloadClient } from "@/get-payload";
import { Product, User } from "@/payload-types";
import { format, parseISO } from 'date-fns';
import { OrdersListClient } from './orders-list-client';

export interface OrdersListProps {
	processedOrders: Array<{
		id: string;
		userEmail: string;
		_isPaid: boolean;
		products: Product[];
		licenseKey: string;
		createdAtFormatted: string;
		paidClass: string;
	}>;
}

export default async function OrdersList() {
	const payload = await getPayloadClient();

	const { docs: orders } = await payload.find({
		collection: "orders",
		depth: 2,
		where: {
			_isPaid: {
				equals: true
			}
		}
	});

	const processedOrders = orders.map(order => {
		const user = order.user as User;
		const products = order.products.map(product => product as Product);
		const paidClass = order._isPaid ? 'text-green-500' : 'text-red-500';
		const createdAtFormatted = format(parseISO(order.createdAt), 'dd MMMM yyyy hh:mm a');

		return {
			id: order.id,
			userEmail: user.email,
			_isPaid: order._isPaid,
			products,
			licenseKey: order.licenseKey,
			createdAtFormatted,
			paidClass,
			updatedAt: order.updatedAt,
			createdAt: order.createdAt,
			user: order.user
		};
	});


	return <OrdersListClient processedOrders={processedOrders} />;
}