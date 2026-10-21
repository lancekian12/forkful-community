import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploaded photos stored in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // Vercel caps function request bodies at 4.5 MB.
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
