import { loadEnvConfig } from "@next/env";

// Tests empty the comments table, so they must only ever talk to the Neon
// `test` branch. Take DATABASE_URL from .env.test.local, never from anywhere else.
const { loadedEnvFiles } = loadEnvConfig(process.cwd(), false);
const testUrl = loadedEnvFiles.find((f) => f.path === ".env.test.local")?.env
  .DATABASE_URL;
if (!testUrl) {
  throw new Error("Tests need DATABASE_URL in .env.test.local (the Neon test branch).");
}
process.env.DATABASE_URL = testUrl;
delete process.env.DATABASE_URL_UNPOOLED;
