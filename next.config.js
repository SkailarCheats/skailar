/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'skailar.com',
                port: '',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'cdn.skailar.com',
                port: '',
                pathname: '**'
            }
        ],
    },
    async headers() {
        return [
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self' cdn.skailar.com; img-src 'self' https://*; child-src 'none';",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "no-referrer",
                    }
                ]
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/faq',
                destination: '/frequently-asked-questions',
                permanent: true
            },
            {
                source: '/faqs',
                destination: '/frequently-asked-questions',
                permanent: true
            },
            {
                source: '/help',
                destination: 'https://help.skailar.com',
                permanent: true
            },
            {
                source: '/discord',
                destination: 'https://discord.gg/skailar',
                permanent: true
            },
            {
                source: '/settings/:username',
                destination: '/account/:username',
                permanent: true
            },
            {
                source: '/products/:id',
                destination: '/product/:id',
                permanent: true
            },
            {
                source: '/terms',
                destination: '/legal/terms',
                permanent: true
            },
            {
                source: '/tos',
                destination: '/legal/terms',
                permanent: true
            },
            {
                source: '/privacy',
                destination: '/legal/terms',
                permanent: true
            },
            {
                source: '/cookies',
                destination: '/legal/terms',
                permanent: true
            },
            {
                source: '/legal/tos',
                destination: '/legal/terms',
                permanent: true
            },
            {
                source: '/legal/cookies',
                destination: '/legal/terms',
                permanent: true
            },
            {
                source: '/careers',
                destination: 'https://careers.skailar.com',
                permanent: true
            },
            {
                source: '/jobs',
                destination: 'https://careers.skailar.com',
                permanent: true
            },
            {
                source: '/job',
                destination: 'https://careers.skailar.com',
                permanent: true
            },
            {
                source: '/career',
                destination: 'https://careers.skailar.com',
                permanent: true
            }
        ]
    }
}

module.exports = nextConfig
