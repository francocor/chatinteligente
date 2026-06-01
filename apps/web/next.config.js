/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
  experimental: {
    typedRoutes: false,
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;