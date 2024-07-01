import cors from 'cors';
import express, { NextFunction } from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";

import { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from '@trpc/server/adapters/express';
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { appRouter } from "./trpc";
import { stripeWebhookHandler } from "./webhooks";

import axios from 'axios';
import nextBuild from "next/dist/build";
import path from "path";
import { cookies } from 'next/headers';
import { getServerSideUser } from './lib/payload-utils';
import { Product, User } from './payload-types';

const app = express();

app.use(cors({
    origin: 'http://185.229.236.134:3000'
}))

const PORT = Number(process.env.PORT) || 3000;

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res })

export type ExpressContext = inferAsyncReturnType<typeof createContext>
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
    const webhookMiddleware = bodyParser.json({
        verify: (req: WebhookRequest, _, buffer) => {
            req.rawBody = buffer
        }
    })

    app.post('/api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler);

    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`Admin URL: ${cms.getAdminURL()}`)
            },
        },
    })

    if (process.env.NEXT_BUILD) {
        app.listen(PORT, async () => {
            payload.logger.info("NextJS Building for Production")
            // @ts-expect-error
            await nextBuild(path.join(__dirname, '../'))

            process.exit()
        })

        return
    }

    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    }))

    // Seller and Reseller Endpoints
    app.get('/api/check-license', async (req, res) => {
        const license = req.query.license;

        if (!license) {
            return res.status(400).json({ error: 'License key is required' });
        }

        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=verify&key=${license}`);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to verify license key' });
        }
    });

    app.get('/api/unban-license', async (req, res) => {
        const { key } = req.query;

        if (!key) {
            return res.status(400).json({ error: 'License key is required' });
        }

        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=unban&key=${key}`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to unban license key' });
        }
    });

    app.get('/api/ban-license', async (req, res) => {
        const { key } = req.query;

        if (!key) {
            return res.status(400).json({ error: 'License Key is Required' })
        }

        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=ban&key=${key}&reason=Automated%20Ban&userToo=false`);
            res.json(response.data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to ban license key' })
        }
    })

    app.get('/api/delete-license', async (req, res) => {
        const { key } = req.query;

        if (!key) {
            return res.status(400).json({ error: 'License key is required' });
        }

        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=del&key=${key}&userToo=false`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete license key' });
        }
    });

    app.get('/api/all-licenses', async (req, res) => {
        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=fetchallkeys&format=json`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get license keys' });
        }
    });

    app.get('/api/info-license', async (req, res) => {
        const { key } = req.query;

        if (!key)
            return res.status(400).json({ error: 'key is required.' })

        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=info&key=${key}`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get license information' })
        }
    });

    app.get('/api/create-reseller', async (req, res) => {
        const { user, pass, level, email } = req.query;

        try {
            const response = await axios.get(`https://api.skailar.com/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=addAccount&role=Reseller&user=${user}&pass=${pass}=&keylevels=${level}&email=${email}`)
            res.json(response.data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to create reseller account' })
        }
    })

    // Discord Bot Endpoints
    app.get('/api/get-license/:id/:apiKey', async (req, res) => {
        const { id, apiKey } = req.params

        if (apiKey === process.env.DISCORD_API_KEY) {
            try {
                const payload = await getPayloadClient()
                const licenseKey = await payload.findByID({
                    collection: 'orders',
                    id: id
                })

                const user = licenseKey.user as User

                if (!user) {
                    console.log('No User')
                }

                const response = {
                    licenseKey: licenseKey,
                    user: user
                };

                return res.json(response)
            } catch (error) {
                res.status(500).json({ error: 'Failed to get License Key' })
            }
        } else {
            res.status(500).json({ error: 'Unauthorized ' })
        }
    })

    app.get('/api/get-users/:username/:apiKey', async (req, res) => {
        const { username, apiKey } = req.params

        if (apiKey === process.env.DISCORD_API_KEY) {

            try {
                const payload = await getPayloadClient()
                const users = await payload.find({
                    collection: 'users',
                    where: {
                        username: {
                            equals: username
                        }
                    }
                })

                return res.json(users)
            } catch (error) {
                res.status(500).json({ error: 'Failed to get Users' })
            }
        } else {
            res.status(500).json({ error: 'Unauthorized ' })
        }
    })

    app.get('/api/product/:id/delete/:apiKey', async (req, res) => {
        const { id, apiKey } = req.params

        if (apiKey === process.env.DISCORD_API_KEY) {
            try {
                const payload = await getPayloadClient()
                const product = await payload.delete({
                    collection: 'products',
                    id: id
                })

                return res.status(200).json({ success: 'Product Successfully Deleted' })
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete Product' })
            }
        } else {
            res.status(500).json({ error: 'Unauthorized ' })
        }
    })

    app.use((req, res) => nextHandler(req, res));

    nextApp.prepare().then(() => {
        payload.logger.info('Next.js Started')

        app.listen(PORT, async () => {
            payload.logger.info(`NextJS App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
        })
    })
}

start()