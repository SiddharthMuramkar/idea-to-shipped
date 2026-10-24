import { readFileSync } from "node:fs";
const raw = readFileSync(process.argv[2], "utf8");
const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
const words = (s) => s.replace(/`[^`]*`/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const lines = body.split("\n"); let sec = "(intro)"; const counts = {}; let inFence = null, kind = null, inner = false;
for (const l of lines) {
  const m = l.match(/^(`{3,})(.*)$/);
  if (inFence) {
    if (l.startsWith(inFence) && l.slice(inFence.length).trim() === "" && l.match(/^`+/)[0].length === inFence.length) { inFence = null; continue; }
    if (["callout","try","site-story"].includes(kind)) {
      if (/^`{3}/.test(l)) { inner = !inner; continue; }
      if (inner || /^#{1,6} /.test(l)) continue;
      const k = kind === "site-story" ? "[site-story]" : sec; counts[k] = (counts[k] || 0) + words(l);
    }
    continue;
  }
  if (m) { inFence = m[1]; kind = m[2].trim().split(/\s+/)[0]; inner = false; continue; }
  if (/^## /.test(l)) { sec = l; continue; }
  if (/^#{1,6} /.test(l)) continue;
  counts[sec] = (counts[sec] || 0) + words(l);
}
let t = 0; for (const [k, v] of Object.entries(counts)) { console.log(String(v).padStart(5), k); t += v; } console.log(t, "total");
