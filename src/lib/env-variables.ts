export const ENV_VARIABLES = {
  API_URL: process.env.NEXT_PUBLIC_NEST_API_URL || "http://localhost:3130",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  DEMO_EMAIL: process.env.NEXT_PUBLIC_DEMO_EMAIL || "",
  DEMO_PASSWORD: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "",
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  BUCKET_NAME: process.env.NEXT_PUBLIC_BUCKET_NAME ?? "hema",
};
