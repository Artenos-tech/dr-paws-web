import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_EXPORT === "true" ? "export" : undefined,
  trailingSlash: true,
  images:
    process.env.NEXT_EXPORT === "true"
      ? {
          loader: "custom",
          loaderFile: "./image-loader.ts",
          unoptimized: true,
          domains: ["localhost", "maps.googleapis.com"],
        }
      : {
          domains: ["localhost", "maps.googleapis.com"],
        },
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.NEXT_EXPORT === "true") {
      config.resolve.alias["@/public/assets/images"] = path.resolve(
        __dirname,
        "public/assets/optimized-images"
      );
    }
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
