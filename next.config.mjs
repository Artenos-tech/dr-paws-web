import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
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
