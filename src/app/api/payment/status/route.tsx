import { ReceiptEmailHtml } from "@/components/emails/receipt-email";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { Product, User } from "@/payload-types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fetchLicenseKey = async (
	level: string,
	expiry: string
): Promise<string> => {
	const response = await fetch(
		`https://api.skailar.com/api/seller/?sellerkey=${process.env.NEXT_PUBLIC_SKAILAR_SELLER_KEY}&type=add&format=json&expiry=${expiry}&mask=***************&level=${level}&amount=1&owner=Skailar&character=2&note=Generated%20From%20Skailar`
	);
	const licenseKey = await response.text();
	return licenseKey;
};

const generateLicenseKeys = async (
	products: Product[]
): Promise<{ [key: string]: string }> => {
	const licenseKeys: { [key: string]: string } = {};
	for (const product of products) {
		if (product.level && product.expiry) {
			const licenseKey = await fetchLicenseKey(product.level, product.expiry);
			licenseKeys[product.id] = licenseKey;
		} else {
			console.warn(
				`Skipping license key generation for product ${product.name} due to missing level or expiry`
			);
		}
	}
	return licenseKeys;
};

const checkPayment = async (id: string) => {
	const resp = await fetch(`https://api.nowpayments.io/v1/payment/${id}`, {
		method: "GET",
		headers: new Headers({
			"x-api-key": process.env.NOWAPIKEY || "",
		}),
	});
	const d = await resp.json();
	if (d.payment_status === "finished") {
		return { success: true };
	} else {
		return {
			success: false,
			message: `Payment status is ${d.payment_status}`,
		};
	}
};
export async function POST(req: Request) {
	try {
		const nextCookies = cookies();
		const { user } = await getServerSideUser(nextCookies);
		const body = await req.json();
		const { productIds, id } = body;
		const paymentStatus = await checkPayment(id);
		if (!paymentStatus.success) {
			return NextResponse.json(
				{
					success: false,
					message: paymentStatus.message,
				},
				{ status: 400 }
			);
		}

		if (productIds.length === 0) {
			return NextResponse.json(
				{
					success: false,
					message: `Cart might be empty`,
				},
				{ status: 400 }
			);
		}

		const payload = await getPayloadClient();
		const ids = body.productIds.map((id: string) => id);
		const { docs: products } = await payload.find({
			collection: "products",
			where: {
				id: {
					in: ids,
				},
			},
		});
		const filterProducts = products.filter((prod) => Boolean(prod.priceId));
		const newOrder = await payload.create({
			collection: "orders",
			data: {
				_isPaid: true,
				products: filterProducts.map((prod) => prod.id),
				user: user?.id as string,
			},
		});

		const isUser = (obj: any): obj is User => {
			return obj && typeof obj === "object" && "id" in obj;
		};

		let orderUserId: string | undefined;

		if (isUser(newOrder?.user)) {
			orderUserId = newOrder.user.id;
		} else if (typeof newOrder?.user === "string") {
			orderUserId = newOrder.user;
		}

		const { docs: users } = await payload.find({
			collection: "users",
			where: {
				id: {
					equals: orderUserId,
				},
			},
		});

		const [orderUser] = users;
		if (!orderUser) {
			return NextResponse.json(
				{ message: "No such user exists.", success: false },
				{ status: 404 }
			);
		}

		const { docs: orders } = await payload.find({
			collection: "orders",
			depth: 2,
			where: {
				id: {
					equals: newOrder.id,
				},
			},
		});

		const [order] = orders;
		if (!order) {
			return NextResponse.json(
				{ message: "No such order exists.", success: false },
				{ status: 404 }
			);
		}

		await payload.update({
			collection: "orders",
			id: newOrder.id,
			data: {
				_isPaid: true,
			},
		});

		const product = newOrder.products[0] as Product;

		try {
			const licenseKeys = await generateLicenseKeys(
				order.products as Product[]
			);
			const licenseKeysResponse = JSON.parse(licenseKeys[product.id]);

			await payload.update({
				collection: "orders",
				id: newOrder.id,
				data: {
					licenseKey: licenseKeysResponse.key,
				},
			});

			const data = await resend.emails.send({
				from: "Skailar <no-reply@skailar.com>",
				to: [user?.email as string],
				subject: "Thank you for your order! This is your receipt.",
				html: ReceiptEmailHtml({
					date: new Date(),
					email: user?.email as string,
					orderId: newOrder.id,
					products: order.products as Product[],
				}),
			});
		} catch (error: any) {
			return NextResponse.json({ message: error.message, success: false });
		}

		if (newOrder) {
			return NextResponse.json({
				success: true,
				message: `Purchased successfully`,
				newOrder,
			});
		} else {
			return NextResponse.json({
				success: false,
				message: `Some error occurred`,
			});
		}
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{
				status: 400,
			}
		);
	}
}
