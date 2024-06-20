import express from 'express';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { ReceiptEmailHtml } from './components/emails/receipt-email';
import { getPayloadClient } from './get-payload';
import { getExpiryInDays, getLevel } from './lib/orders';
import { stripe } from './lib/stripe';
import { Product } from './payload-types';
import { WebhookRequest } from './server';

export const resend = new Resend(process.env.RESEND_API_KEY);

const fetchLicenseKey = async (level: string, expiry: string): Promise<string> => {
    // const response = await fetch(`/api/create-license?expiry=${expiry}&level=${level}`);
    const response = await fetch(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=add&format=json&expiry=${expiry}&mask=***************&level=${level}&amount=1&owner=Skailar&character=2&note=Generated%20From%20Skailar`);
    const licenseKey = await response.text();
    return licenseKey;
};

const generateLicenseKeys = async (products: Product[]): Promise<{ [key: string]: string }> => {
    const licenseKeys: { [key: string]: string } = {};
    for (const product of products) {
        const level = getLevel(product.name);
        const expiryInDays = getExpiryInDays(product.name);
        const licenseKey = await fetchLicenseKey(level, expiryInDays);
        licenseKeys[product.id] = licenseKey;
    }
    return licenseKeys;
};

export const stripeWebhookHandler = async (req: express.Request, res: express.Response) => {
    const webhookRequest = req as any as WebhookRequest;
    const body = webhookRequest.rawBody;
    const signature = req.headers['stripe-signature'] || '';

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (!session?.metadata?.userId || !session?.metadata?.orderId) {
        return res.status(400).send(`Webhook Error: No user present in Metadata`);
    }

    if (event.type === 'checkout.session.completed') {
        const payload = await getPayloadClient();

        const { docs: users } = await payload.find({
            collection: 'users',
            where: {
                id: {
                    equals: session.metadata.userId
                }
            }
        });

        const [user] = users;

        if (!user) {
            return res.status(404).json({ error: 'No such user exists.' });
        }

        const { docs: orders } = await payload.find({
            collection: "orders",
            depth: 2,
            where: {
                id: {
                    equals: session.metadata.orderId
                }
            }
        });

        const [order] = orders;

        if (!order) {
            return res.status(404).json({ error: 'No such order exists.' });
        }

        await payload.update({
            collection: 'orders',
            id: session.metadata.orderId,
            data: {
                _isPaid: true,
            }
        });

        const product = order.products[0] as Product;

        try {
            const licenseKeys = await generateLicenseKeys(order.products as Product[]);
            const licenseKeysResponse = JSON.parse(licenseKeys[product.id]);

            await payload.update({
                collection: 'orders',
                id: session.metadata.orderId,
                data: {
                    licenseKey: licenseKeysResponse.key,
                }
            });

            const data = await resend.emails.send({
                from: 'Skailar <no-reply@skailar.com>',
                to: [user.email],
                subject: 'Thank you for your order! This is your receipt.',
                html: ReceiptEmailHtml({
                    date: new Date(),
                    email: user.email,
                    orderId: session.metadata.orderId,
                    products: order.products as Product[],
                })
            });
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    return res.status(200).send();
};
