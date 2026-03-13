import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment to debug hydration errors (shows full React error messages in production build):
  // experimental: { allowDevelopmentBuild: true },
  env: {
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

export default nextConfig;
