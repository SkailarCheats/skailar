import { NextResponse } from "next/server";

const formatPrice = (priceString: string) => {
	// Step 1: Remove the currency symbol and whitespace
	let numericString = priceString.replace(/[^\d,.-]/g, "");

	// Step 2: Replace comma with a dot
	numericString = numericString.replace(",", ".");

	// Step 3: Convert the string to a number
	const priceNumber = parseFloat(numericString);
	return priceNumber;
};
const getResponse = async (price: string, payCurrency: string) => {

	var json = JSON.stringify({
		price_amount: formatPrice(price),
		price_currency: "EUR",
		pay_currency: payCurrency,
		// pay_address:"TSyfA18d3sRctDb1vCj1fbpdp6r1B9CY6P",
		ipn_callback_url: "https://nowpayments.io",
		order_id: "RGDBP-213142",
		order_description: "Crypto Payment for testing",
	});
	const resp = await fetch("https://api.nowpayments.io/v1/payment", {
		method: "POST",
		headers: new Headers({
			"x-api-key": process.env.NOWAPIKEY || "",
			"Content-Type": "application/json",
		}),
		body: json,
	});
	const data = await resp.json();
	return data;
};

export async function POST(req: any) {
	try {
		const body = await req.json();
		const data = await getResponse(body.price, body.payCurrency);
		console.log(data);
		if (data) {
			return NextResponse.json(
				{
					success: true,
					message: "Deposit address created please payout and click paid",
					payout: data,
				},
				{
					status: 400,
				}
			);
		} else {
			return NextResponse.json(
				{ success: false, message: "An error occurred while creating address" },
				{
					status: 400,
				}
			);
		}
	} catch (error: any) {
		console.log(error + "error");
		return NextResponse.json(
			{ success: false, message: error.message },
			{
				status: 400,
			}
		);
	}
}
