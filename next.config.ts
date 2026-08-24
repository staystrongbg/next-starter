import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compress: true,
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
