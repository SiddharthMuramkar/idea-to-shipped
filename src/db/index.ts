import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Talks to Neon over HTTP: fast for the single queries a serverless function makes.
export const db = drizzle({ client: neon(process.env.DATABASE_URL!) });
