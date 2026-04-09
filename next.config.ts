import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "minio.stour.com.vn",
      },
      {
        protocol: "http",
        hostname: "103.89.94.201",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // hoặc "50mb"
    },
  },
  cacheComponents: true
};

export default withNextIntl(nextConfig);
