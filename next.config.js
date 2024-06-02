/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'w7.pngwing.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'e7.pngegg.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '**'
            },
            {
                protocol: 'http',
                hostname: '185.229.236.134',
                port: '3000',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'skailar.com',
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
                ]
            }
        ]
    }
}

module.exports = nextConfig
