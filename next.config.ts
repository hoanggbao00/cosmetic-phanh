import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    reactCompiler: true,
  },
  distDir: process.env.NODE_ENV === "production" ? ".next" : ".next-dev",
};

export default nextConfig;
