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
                ]
            }
        ]
    }
}

module.exports = nextConfig
