import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    '@life-track/db',
    '@life-track/shared',
    '@paralleldrive/cuid2',
  ],
};

export default nextConfig;