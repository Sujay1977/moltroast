/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    typescript: {
        // Fail build on type errors
        ignoreBuildErrors: false,
    },
    eslint: {
        // Fail build on ESLint errors
        ignoreDuringBuilds: false,
    },
}

module.exports = nextConfig
