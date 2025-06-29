/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  output: undefined, // Explicitly disable static export to allow API routes
};

module.exports = nextConfig;