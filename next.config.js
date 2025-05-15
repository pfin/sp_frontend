/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking and ESLint during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this experimental feature to completely disable ESLint
  experimental: {
    disableESLint: true
  }
};

module.exports = nextConfig;