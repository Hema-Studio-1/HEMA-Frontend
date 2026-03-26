function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

function inferNextAuthUrl(): string {
  const explicit = trimEnv(process.env.NEXTAUTH_URL);
  if (explicit) return explicit;
  const vercel = trimEnv(process.env.VERCEL_URL);
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  const netlify = trimEnv(process.env.URL);
  if (netlify) return netlify;
  return "";
}

/**
 * Central env map. Uses runtime process.env so Vercel/Netlify builds pick up dashboard env vars.
 * API base: NEXT_PUBLIC_NEST_API_URL, NEXT_PUBLIC_API_URL, or API_URL (server).
 */
// export const ENV_VARIABLES = {
//   NODE_ENV: process.env.NODE_ENV ?? "development",
//   API_URL: trimEnv(process.env.NEXT_PUBLIC_NEST_API_URL) || "",
//   NEXTAUTH_URL: inferNextAuthUrl(),
//   NEXTAUTH_SECRET: trimEnv(process.env.NEXTAUTH_SECRET),
//   DEMO_EMAIL: trimEnv(process.env.NEXT_PUBLIC_DEMO_EMAIL),
//   DEMO_PASSWORD: trimEnv(process.env.NEXT_PUBLIC_DEMO_PASSWORD),
//   SUPABASE_URL: trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
//   SUPABASE_ANON_KEY: trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
//   SUPABASE_SERVICE_ROLE_KEY: trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
//   BUCKET_NAME: trimEnv(process.env.NEXT_PUBLIC_BUCKET_NAME) || "hema",
// };

export const ENV_VARIABLES = {
  NODE_ENV: "development",
  API_URL: "http://13.63.129.97/data-api/v1",
  NEXTAUTH_URL: "http://13.63.129.97/",
  NEXTAUTH_SECRET: "Xbo9CBAsYwQe9tyYyQeqe8w2bZef5sgZ",
  DEMO_EMAIL: "taliballauddin3@yopmail.com",
  DEMO_PASSWORD: "talib123??",
  SUPABASE_URL: "https://ynkusrynhjktlqxpxdmm.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua3VzcnluaGprdGxxeHB4ZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzAxNDYsImV4cCI6MjA3OTA0NjE0Nn0.TEBfkoJGn24SuvaQjCS3cVhAhAYuCXUbTPcnH9vX-qA",
  SUPABASE_SERVICE_ROLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua3VzcnluaGprdGxxeHB4ZG1tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ3MDE0NiwiZXhwIjoyMDc5MDQ2MTQ2fQ.9EggyO9_PrT57CxhWaPVhrWmh8oaVLsTMViVcu56JEk",
  BUCKET_NAME: "hema",
};
