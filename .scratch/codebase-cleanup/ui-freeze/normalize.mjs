// Usage: node normalize.mjs <file.html>
// Prints the page's server-rendered markup with build-specific noise removed,
// one tag per line, so two builds of the same UI diff to nothing.
// Removed: scripts (RSC payload, module ids), <link> tags (hashed asset names),
// Vercel deployment ids (data-dpl-id, &dpl= on image URLs), hashed static paths.
import fs from "node:fs";

const html = fs.readFileSync(process.argv[2], "utf8");

const markup = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*>/gi, "")
  .replace(/ data-dpl-id="[^"]*"/g, "")
  .replace(/&amp;dpl=dpl_[A-Za-z0-9]+/g, "")
  .replace(/[?&]dpl=dpl_[A-Za-z0-9]+/g, "")
  .replace(/dpl_[A-Za-z0-9]+/g, "DPL")
  .replace(/\/_next\/static\/[^"'\s)]+/g, "/_next/static/X")
  .replace(/\s+/g, " ");

console.log(markup.replace(/</g, "\n<").trim());
