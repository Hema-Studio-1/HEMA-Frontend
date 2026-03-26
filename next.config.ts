import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow large uploads (e.g. 4K images) through Server Actions.
      // Default is 1MB which breaks image uploads.
      bodySizeLimit: "1gb",
    },
  },
  // Uncomment to debug hydration errors (shows full React error messages in production build):
  // experimental: { allowDevelopmentBuild: true },
};

export default nextConfig;
