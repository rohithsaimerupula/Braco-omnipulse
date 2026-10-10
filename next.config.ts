import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: '/sign-up',
        destination: '/sign-in',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
