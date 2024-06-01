import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./payment-router";

export const appRouter = router({
    auth: authRouter,
    payment: paymentRouter,

    getInfiniteProducts: publicProcedure.input(z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator
    })).query(async ({ input }) => {
        const { query, cursor } = input
        const { sort, limit, ...queryOpts } = query

        const payload = await getPayloadClient()

        const parsedQueryOpts: Record<string, { equals: string }> = {}

        Object.entries(queryOpts).forEach(([key, value]) => {
            parsedQueryOpts[key] = {
                equals: value,
            }
        })

        const page = cursor || 1

        const { docs: items, hasNextPage, nextPage } = await payload.find({
            collection: "products",
            where: {
                approvedForSale: {
                    equals: 'approved'
                },
                ...parsedQueryOpts
            },
            sort,
            depth: 1,
            limit,
            page
        })

        return {
            items,
            nextPage: hasNextPage ? nextPage : null
        }
    }),

    getStockLicenses: publicProcedure.query(async () => {
        const payload = await getPayloadClient();

        const { docs: products } = await payload.find({
            collection: 'products',
            depth: 1
        });

        const stockLicenses: Record<string, string[]> = {};

        for (const product of products) {
            const productId = product.id;

            const { docs: warehouses } = await payload.find({
                collection: 'warehouse',
                where: {
                    product: {
                        equals: productId
                    }
                },
                depth: 1
            });

            if (warehouses.length > 0) {
                const warehouse = warehouses[0];
                const keys = warehouse.stock?.split('\n').map(key => key.trim()).filter(key => key !== '') ?? [];
                if (keys.length > 0) {
                    stockLicenses[productId.toString()] = keys;
                }
            }
        }

        return stockLicenses;
    })

})

export type AppRouter = typeof appRouter