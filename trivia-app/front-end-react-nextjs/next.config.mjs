/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: false,
    env: {
        // expose to clientside
        WEBSOCKET_ENDPOINT: process.env.WEBSOCKET_ENDPOINT
    }
};

export default nextConfig;
