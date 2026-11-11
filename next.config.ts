import type { NextConfig } from "next";

// Old Lesson addresses go permanently to the new ones. The map lives in
// src/lessons/renamed.ts so the comments query can use it too.
export { RENAMED_LESSONS } from "./src/lessons/renamed";
import { RENAMED_LESSONS } from "./src/lessons/renamed";

// Every Course's files can be read at request time: the comments API checks
// Slugs against all of them, and every page lists the Courses (in its
// footer) when it's rendered again on revalidation. So they ship with the
// server functions of every route.
const CONTENT = ["./content/**/*"];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: Object.fromEntries(
    ["/", "/*", "/courses/*", "/learn/*", "/api/comments"].map((route) => [route, CONTENT]),
  ),
  async redirects() {
    return Object.entries(RENAMED_LESSONS).map(([from, to]) => ({
      source: `/learn/${from}`,
      destination: `/learn/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
