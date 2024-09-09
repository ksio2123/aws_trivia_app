/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: false,
    distDir: 'build',
    env: {
        // expose to client side
        WEBSOCKET_ENDPOINT: process.env.WEBSOCKET_ENDPOINT
    }
};

export default nextConfig;
