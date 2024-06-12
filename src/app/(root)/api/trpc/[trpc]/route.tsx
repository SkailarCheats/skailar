/*
 * This file defines a custom request handler for handling TRPC requests.
 * It sets up a fetchRequestHandler with the specified options, including
 * the TRPC router (appRouter) and the endpoint (/api/trpc). It exports
 * the handler functions for both GET and POST requests.
 */

import { appRouter } from '@/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) => {
    fetchRequestHandler({
        endpoint: "/api/trpc", // TRPC endpoint
        req, // Incoming request object
        router: appRouter, // TRPC router
        // @ts-expect-error context already pass from express middleware
        createContext: () => ({}) // Creating an empty context (no additional context required)
    })
}

// Exporting the handler function for both GET and POST requests
export { handler as GET, handler as POST };
