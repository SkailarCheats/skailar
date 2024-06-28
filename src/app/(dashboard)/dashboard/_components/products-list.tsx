import { getPayloadClient } from "@/get-payload";
import { format, parseISO } from 'date-fns';
import { ProductsListClient, ProcessedProduct } from './products-list-client';

export default async function ProductsList() {
	const payload = await getPayloadClient();

	const { docs: products } = await payload.find({
		collection: "products",
		depth: 2,
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

		const images = product.images.map((img: any) => {
			if (typeof img.image === 'string') {
				return { image: { url: img.image } };
			} else {
				return { image: { url: img.image.url } };
			}
		});

		return {
			id: product.id,
			name: product.name,
			category: product.category as ProcessedProduct['category'],
			approvedForSale: product.approvedForSale || undefined,
			price: product.price,
			createdAt: format(parseISO(product.createdAt), "dd MMMM yyyy HH:MM"),
			images: images,
			orders: orders
		};
	}));

	return <ProductsListClient processedProducts={processedProducts} />;
}