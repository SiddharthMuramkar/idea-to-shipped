import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lesson files are read at request time (the comments API checks slugs, the
  // quiz API grades Answers against them), so ship them with the server
  // functions. Without this, production returns 500 while local dev works.
  outputFileTracingIncludes: {
    "/api/**": ["./content/lessons/**/*"],
    "/learn/*": ["./content/lessons/**/*"],
  },
};

export default nextConfig;
