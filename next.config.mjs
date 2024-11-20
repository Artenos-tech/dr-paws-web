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
        }
      : {
          domains: ["localhost"], // Add any other domains you need
          //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        },
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.NEXT_EXPORT === "true") {
      // Replace original image paths with optimized ones
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
