/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking and ESLint during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;