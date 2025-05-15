import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript type checking and ESLint during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
