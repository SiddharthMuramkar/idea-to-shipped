import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Every Course's files are read at request time (the comments API checks
  // Slugs against all of them), so ship them with the server functions.
  outputFileTracingIncludes: {
    "/api/comments": ["./content/**/*"],
    "/learn/*": ["./content/**/*"],
  },
};

export default nextConfig;
