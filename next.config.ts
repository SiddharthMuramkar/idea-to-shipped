import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lesson files are read at request time (the comments API checks slugs),
  // so ship them with the server functions.
  outputFileTracingIncludes: {
    "/api/comments": ["./content/lessons/**/*"],
    "/learn/*": ["./content/lessons/**/*"],
  },
};

export default nextConfig;
