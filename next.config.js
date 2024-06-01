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
            }
        ],
    },
}

module.exports = nextConfig
