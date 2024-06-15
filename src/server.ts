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
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=verify&key=${license}`);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to verify license key' });
        }
    });

    app.get('/api/create-reseller', async (req, res) => {
        const {
            username,
            password,
            level,
            email
        } = req.query;

        if (!username || !password || !level || !email) {
            return res.status(400).json({ error: 'Username, Password, Level and Email are required' });
        }

        try {
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=addAccount&role=Reseller&user=${username}&pass=${password}&keylevels=${level}?email=${email}`);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create reseller account' });
        }
    });

    app.get('/api/unban-license', async (req, res) => {
        const { key } = req.query;

        if (!key) {
            return res.status(400).json({ error: 'License key is required' });
        }

        try {
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=unban&key=${key}`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to unban license key' });
        }
    });

    app.get('/api/delete-license', async (req, res) => {
        const { key } = req.query;

        if (!key) {
            return res.status(400).json({ error: 'License key is required' });
        }

        try {
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=del&key=${key}&userToo=false`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete license key' });
        }
    });

    app.get('/api/create-license', async (req, res) => {
        const { expiry, level } = req.query;

        if (!expiry || !level)
            return res.status(400).json({ error: 'key, expiry, level are required' })

        try {
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=add&expiry=${expiry}&mask=***************&level=${level}&amount=1&character=2&format=json`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create license key' });
        }
    });

    app.get('/api/all-licenses', async (req, res) => {
        try {
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=fetchallkeys&format=json`)
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
            const response = await axios.get(`https://keyauth.win/api/seller/?sellerkey=${process.env.SKAILAR_SELLER_KEY}&type=info&key=${key}`)
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get license information' })
        }
    });

    app.use((req, res) => nextHandler(req, res));

    nextApp.prepare().then(() => {
        payload.logger.info('Next.js Started')

        app.listen(PORT, async () => {
            payload.logger.info(`NextJS App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
        })
    })
}

start()