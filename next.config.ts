import type { NextConfig } from "next";

// Published Lessons whose Slugs changed. Their old addresses (in links and
// search results out in the world) go permanently to the new ones.
// course.test.ts checks this list against the Slugs it knows were renamed.
export const RENAMED_LESSONS: Record<string, string> = {
  "spec-and-issues": "to-spec",
  "pr-and-ship": "pr",
  architecture: "improve-codebase-architecture",
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Every Course's files are read at request time (the comments API checks
  // Slugs against all of them), so ship them with the server functions.
  outputFileTracingIncludes: {
    "/api/comments": ["./content/**/*"],
    "/learn/*": ["./content/**/*"],
  },
  async redirects() {
    return Object.entries(RENAMED_LESSONS).map(([from, to]) => ({
      source: `/learn/${from}`,
      destination: `/learn/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
