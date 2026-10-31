import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load the same .env files Next.js would: .env.test.local when NODE_ENV=test,
// otherwise .env.local. On Vercel the variables are already set.
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "test");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Neon's pooler runs in transaction mode, which migration tools may not
    // support, so schema changes take the direct connection when there is one.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
});
