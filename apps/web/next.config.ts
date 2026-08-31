import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  transpilePackages: [
    '@life-track/db',
    '@life-track/shared',
    '@paralleldrive/cuid2',
  ],
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/confidentialite',
        permanent: true,
      },
      {
        source: '/rgpd',
        destination: '/confidentialite',
        permanent: true,
      },
    ];
  },
};

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;
