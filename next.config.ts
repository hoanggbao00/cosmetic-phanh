import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    reactCompiler: true,
    useCache: true,
  },
  distDir: process.env.NODE_ENV === "production" ? ".next" : ".next-dev",
  typescript: {
    ignoreBuildErrors: true, // TODO: Remove this
  },
}

export default nextConfig
