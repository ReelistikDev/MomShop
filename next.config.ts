import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage serves product photos uploaded via the admin; Unsplash
    // is allowed for any remote stand-in imagery.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
