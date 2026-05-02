/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;