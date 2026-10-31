import { configDefaults, defineConfig } from "vitest/config";

// Inline projects inherit this root config (Vitest 5), so the shared settings
// live here and each project adds only what differs.
//   content: the Lesson parser and the content lint. Plain files on disk, no
//            database and no env files, so `npm run test:content` runs anywhere.
//   render:  page components rendered to HTML on the server. No database and
//            no env files either.
//   db:      everything else. These tests hit the Neon `test` branch (ADR 0003),
//            so they load .env.test.local and run one file at a time.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    projects: [
      {
        test: {
          name: "content",
          include: ["src/lessons/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "render",
          include: ["src/app/**/*.test.tsx"],
        },
      },
      {
        test: {
          name: "db",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: [...configDefaults.exclude, "src/lessons/**", "src/app/**/*.test.tsx"],
          setupFiles: ["./src/test/setup-env.ts"],
          fileParallelism: false,
        },
      },
    ],
  },
});
