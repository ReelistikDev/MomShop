import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/lifestyle imagery is local (/public/images). Unsplash is allowed
    // so the brand can drop in remote photography later without code changes.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
