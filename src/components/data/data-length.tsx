import { getPayloadClient } from "@/get-payload";
import { LucidePackageOpen, ShieldCheck, ShoppingBag, UserCheck } from 'lucide-react';
import { DataCard } from "./data-card";
import { LicensesDataCard } from "./license-data-card";

export const DataLength = async () => {
	try {
		const payload = await getPayloadClient();

		const [users, orders, resellers, products] = await Promise.all([
			payload.find({ collection: 'users', where: { role: { equals: 'customer' } }, limit: 0 }),
			payload.find({ collection: 'orders', limit: 0 }),
			payload.find({ collection: 'users', where: { role: { equals: 'reseller' }, _verified: { equals: true } }, limit: 0 }),
			payload.find({ collection: 'products', limit: 0, where: { approvedForSale: { equals: 'approved' } } })
		]);

		const data = [
			{ title: 'Products', value: products.docs.length, Icon: ShoppingBag },
			{ title: 'Customers', value: users.docs.length, Icon: UserCheck },
			{ title: 'Orders', value: orders.docs.length, Icon: LucidePackageOpen },
			{ title: 'Verified Resellers', value: resellers.docs.length, Icon: ShieldCheck },
		];

		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{data.map((item) => (
					<DataCard key={item.title} {...item} />
				))}
				<LicensesDataCard />
			</div>
		);
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
};