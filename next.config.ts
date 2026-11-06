import type { NextConfig } from "next";

// Published Lessons whose Slugs changed. Their old addresses (in links and
// search results out in the world) go permanently to the new ones.
// course.test.ts checks this list against the Slugs it knows were renamed.
export const RENAMED_LESSONS: Record<string, string> = {
  "spec-and-issues": "to-spec",
  "pr-and-ship": "pr",
  architecture: "improve-codebase-architecture",
};

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
