import { getPayloadClient } from "@/get-payload";
import { User } from "@/payload-types";
import { ProcessedProduct, ProductsListClient } from './reseller-products-list-client';

export default async function ProductsList({ user }: { user: User }) {
	const payload = await getPayloadClient();

	const { docs: products } = await payload.find({
		collection: "reseller_products",
		limit: 0,
		where: {
			approvedForSale: {
				equals: 'approved'
			}
		}
	});

	const processedProducts: ProcessedProduct[] = await Promise.all(products.map(async (product) => {
		const { docs: orders } = await payload.find({
			collection: "orders",
			where: {
				products: {
					equals: {
						product,
					},
				},
			},
		});

		return {
			id: product.id,
			name: product.name,
			category: product.category as ProcessedProduct['category'],
			price: product.price,
			orders: orders
		};
	}));

	return <ProductsListClient processedProducts={processedProducts} />;
}