export const ENV_VARIABLES = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_URL: process.env.NEXT_PUBLIC_NEST_API_URL || "http://13.63.129.97/api/v1",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://13.63.129.97/api/v1",
  NEXTAUTH_SECRET:
    process.env.NEXTAUTH_SECRET || "Xbo9CBAsYwQe9tyYyQeqe8w2bZef5sgZ",
  DEMO_EMAIL: process.env.NEXT_PUBLIC_DEMO_EMAIL || "",
  DEMO_PASSWORD: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "",
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ynkusrynhjktlqxpxdmm.supabase.co",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua3VzcnluaGprdGxxeHB4ZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzAxNDYsImV4cCI6MjA3OTA0NjE0Nn0.TEBfkoJGn24SuvaQjCS3cVhAhAYuCXUbTPcnH9vX-qA",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua3VzcnluaGprdGxxeHB4ZG1tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ3MDE0NiwiZXhwIjoyMDc5MDQ2MTQ2fQ.9EggyO9_PrT57CxhWaPVhrWmh8oaVLsTMViVcu56JEk",
  BUCKET_NAME: process.env.NEXT_PUBLIC_BUCKET_NAME ?? "hema",
};
