import express from 'express';
import { WebhookRequest } from './server';
import { stripe } from './lib/stripe';
import Stripe from 'stripe';
import { getPayloadClient } from './get-payload';
import { Resend } from 'resend';
import { ReceiptEmailHtml } from './components/emails/receipt-email';
import { Product } from './payload-types';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        const product = order.products[0];

        // Verifica se il prodotto è un oggetto e contiene l'id
        const productId = typeof product === 'string' ? product : product.id;

        const { docs: warehouses } = await payload.find({
            collection: 'warehouse',
            where: {
                product: {
                    equals: productId
                }
            }
        });

        const [warehouse] = warehouses;

        if (!warehouse) {
            return res.status(404).json({ error: 'No such warehouse exists.' });
        }

        const licenseKeys = warehouse?.stock?.split('\n').filter(Boolean);
        const licenseKey = licenseKeys.shift();

        if (!licenseKey) {
            return res.status(404).json({ error: 'No license keys available.' });
        }

        await payload.update({
            collection: 'warehouse',
            id: warehouse.id,
            data: {
                stock: licenseKeys.join('\n'),
            },
        });

        try {
            const data = await resend.emails.send({
                from: 'Skailar <no-reply@skailar.com>',
                to: [user.email],
                subject: 'Thank you for your order! This is your receipt.',
                html: ReceiptEmailHtml({
                    date: new Date(),
                    email: user.email,
                    orderId: session.metadata.orderId,
                    products: order.products as Product[],
                    licenseKey: licenseKey
                })
            });
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    return res.status(200).send();
};
