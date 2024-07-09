import { getPayloadClient } from "@/get-payload";
import { DollarSign, Users, ShoppingCart } from 'lucide-react';
import { DataCard } from "./data-card";
import { LicensesDataCard } from "./license-data-card";

export const DataLength = async () => {
	try {
		const payload = await getPayloadClient();

		const [users, orders, resellers] = await Promise.all([
			payload.find({ collection: 'users', limit: 0 }),
			payload.find({ collection: 'orders', limit: 0 }),
			payload.find({ collection: 'users', where: { role: { equals: 'reseller' }, _verified: { equals: true } }, limit: 0 })
		]);

		const data = [
			{ title: 'Customers', value: users.docs.length, Icon: Users },
			{ title: 'Orders', value: orders.docs.length, Icon: ShoppingCart },
			{ title: 'Verified Resellers', value: resellers.docs.length, Icon: DollarSign }
		];

		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<LicensesDataCard />
				{data.map((item) => (
					<DataCard key={item.title} {...item} />
				))}
			</div>
		);
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
};