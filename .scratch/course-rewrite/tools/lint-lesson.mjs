// Local stand-in for PR A's `npm run test:content`, implementing authoring contract v1.
// Usage: node lint-lesson.mjs <lesson.md>...   Prints errors (fail) and warnings.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ORIGINAL = ["start-here", "grilling", "domain-modeling", "spec-and-issues", "wizard", "prototype", "tdd", "code-review", "pr-and-ship", "diagnosing-bugs", "models-effort-ultracode", "main-flow"];
const SKILLS = ["git-guardrails-claude-code", "setup-pre-commit", "migrate-to-shoehorn", "scaffold-exercises", "ask-matt", "grill-with-docs", "implement", "implement-spec", "improve-codebase-architecture", "retro", "setup-matt-pocock-skills", "to-spec", "to-tickets", "triage", "wayfinder", "code-review", "codebase-design", "diagnosing-bugs", "domain-modeling", "pr", "prototype", "research", "tdd", "wizard", "grill-me", "handoff", "teach", "to-questionnaire", "wait-what", "grilling", "writing-for-agents"];
// Built-in commands we may cite; extend only with commands confirmed in Claude Code's docs.
const BUILTINS = ["clear", "compact", "context", "model", "effort", "fast", "rewind", "init", "help", "config", "permissions", "plan", "resume", "agents", "mcp", "hooks", "memory", "cost", "usage", "status", "doctor", "login", "logout", "plugin", "skills", "ultrareview", "review", "add-dir", "exit", "export", "terminal-setup", "vim", "btw", "reload-skills", "reload-plugins", "workflows", "autocompact", "simplify", "security-review", "loop", "schedule", "statusline"];
const KINDS = ["goals", "scene", "checkpoint", "test", "callout", "try", "site-story", "sources"];
const SCENES = ["chat", "terminal", "flow", "files", "meter", "photos"];
const CALLOUTS = ["tip", "watch-out", "big-idea"];
const HEADER_KEYS = ["title", "slug", "order", "part", "image", "imageAlt", "imageCredit"];

function words(s) {
  return s.replace(/`[^`]*`/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

function lint(file) {
  const errors = [], warns = [];
  const raw = readFileSync(file, "utf8");
  if (raw.includes("\r")) errors.push("CRLF line endings");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { errors: ["missing --- header"], warns, stats: {} };
  const hkeys = m[1].split("\n").map((l) => l.slice(0, l.indexOf(":")).trim());
  for (const k of new Set(hkeys)) if (hkeys.filter((x) => x === k).length > 1) errors.push(`header: duplicate key ${k}`);
  const header = Object.fromEntries(m[1].split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
  for (const k of Object.keys(header)) if (!HEADER_KEYS.includes(k)) errors.push(`header: unknown key "${k}"`);
  for (const k of HEADER_KEYS) if (!header[k]) errors.push(`header: missing ${k}`);
  if (header.part && !/^[1-4]$/.test(header.part)) errors.push(`header: part must be 1-4`);
  const slug = header.slug;
  if (header.image) { try { readFileSync(path.join(path.dirname(file), "..", "..", "public", header.image)); } catch { errors.push(`header: image ${header.image} not found under public/`); } }
  const body = m[2];
  const lines = body.split("\n");

  // Walk the body into blocks and prose, tracking ## sections.
  const blocks = []; const prose = []; let section = "(intro)"; let sawH2 = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const open = line.match(/^(`{3,})(.*)$/);
    if (open) {
      const fence = open[1]; const info = open[2].trim();
      const content = []; let j = i + 1;
      while (j < lines.length && !(lines[j].startsWith(fence) && lines[j].slice(fence.length).trim() === "" && lines[j].match(/^`+/)[0].length === fence.length)) { content.push(lines[j]); j++; }
      if (j >= lines.length) errors.push(`unclosed fence at body line ${i + 1}`);
      const [kind, arg] = info.split(/\s+/);
      const typed = KINDS.includes(kind);
      if (typed && content.some((l) => /^```/.test(l)) && fence.length < 4) errors.push(`${kind} block containing a fence must use four backticks (line ${i + 1})`);
      blocks.push({ kind: typed ? kind : "code", arg, info, content, line: i + 1, section, beforeH2: !sawH2, index: blocks.length });
      i = j; continue;
    }
    if (/^## /.test(line)) { section = line; sawH2 = true; }
    prose.push(line);
  }
  const KINDRE = /^\s*(?:>\s*)?`{3,}(goals|scene|checkpoint|test|callout|try|site-story|sources)\b/;
  for (const l of prose) if (/^(\s+|>\s*)`{3,}/.test(l) && KINDRE.test(l)) errors.push(`typed fence not at top level: "${l.trim().slice(0, 40)}"`);
  for (const b of blocks) if (b.kind !== "code") for (const l of b.content) if (KINDRE.test(l)) errors.push(`typed fence nested inside ${b.kind} block (line ${b.line})`);
  for (const b of blocks) if (b.kind === "code" && /^(tip|watch-out|big-idea|chat|terminal|flow|files|meter)$/i.test(b.info.trim())) errors.push(`bare fence language "${b.info.trim()}" looks like a block name (line ${b.line})`);
  for (const b of blocks) if ((b.kind === "scene" || b.kind === "test") && b.beforeH2) errors.push(`${b.kind} block in the intro, before the first ## (line ${b.line})`);
  for (const b of blocks.filter((b) => b.kind === "scene")) for (const l of b.content) { const t = l.match(/^(title|node):\s*(.*)$/); if (t && /[*`_\[\]]/.test(t[2].replace(/[A-Za-z0-9]_[A-Za-z0-9]/g, ""))) warns.push(`scene ${t[1]} should be plain text: "${t[2].slice(0, 50)}"`); }
  const proseText = prose.join("\n");
  // Contract v1.1: prose = text between fences (minus headings) + callout/try/site-story bodies (minus code inside them).
  const stripCode = (ls) => { const out = []; let inCode = false; for (const l of ls) { if (/^`{3,}/.test(l)) { inCode = !inCode; continue; } if (!inCode) out.push(l); } return out; };
  const noHeadings = (ls) => ls.filter((l) => !/^#{1,6} /.test(l));
  const proseWords = words(noHeadings(prose).join("\n")) + blocks.filter((b) => ["callout", "try", "site-story"].includes(b.kind)).reduce((n, b) => n + words(noHeadings(stripCode(b.content)).join("\n")), 0);
  const isStart = slug === "start-here";
  const [minW, maxW] = isStart ? [900, 1400] : [1800, 3000];
  if (proseWords < minW) errors.push(`prose ${proseWords} words < ${minW}`);
  if (proseWords > maxW) errors.push(`prose ${proseWords} words > ${maxW}`);

  // goals
  const goals = blocks.filter((b) => b.kind === "goals");
  if (goals.length !== 1) errors.push(`goals blocks: ${goals.length} (need exactly 1)`);
  for (const g of goals) {
    if (!g.beforeH2) errors.push("goals block must come before the first ##");
    const items = g.content.filter((l) => /^[-*] /.test(l));
    if (items.length < 3 || items.length > 4) errors.push(`goals: ${items.length} items (need 3-4)`);
    for (const it of items) if (!/You'll be able to /.test(it)) warns.push(`goal not phrased "You'll be able to…": ${it.slice(0, 60)}`);
  }

  // scenes
  const scenes = blocks.filter((b) => b.kind === "scene");
  if (scenes.length < 1) errors.push("no scene");
  const perSection = {};
  for (const s of scenes) {
    perSection[s.section] = (perSection[s.section] || 0) + 1;
    if (!SCENES.includes(s.arg)) errors.push(`scene kind "${s.arg}" invalid (line ${s.line})`);
    const steps = s.content.filter((l) => /^# /.test(l)).length;
    if (steps < 4 || steps > 8) errors.push(`scene at line ${s.line}: ${steps} steps (need 4-8)`);
    const firstStep = s.content.findIndex((l) => /^# /.test(l));
    const settings = s.content.slice(0, firstStep === -1 ? s.content.length : firstStep).filter((l) => l.trim());
    if (!settings.some((l) => /^title: /.test(l))) warns.push(`scene at line ${s.line}: no title`);
    for (const l of s.content.slice(firstStep + 1)) {
      if (!l.trim() || /^# /.test(l)) continue;
      const ok = { chat: /^(you|agent): /, terminal: /.*/, flow: /^at: \S+/, files: /^[+~] \S/, meter: /^fill: [\d.]+%? \| /, photos: /^photo: \/photos\/\S+ \| [^|]+ \| [^|]+$/ }[s.arg];
      if (ok && !ok.test(l)) errors.push(`scene ${s.arg} at line ${s.line}: bad step line "${l.slice(0, 50)}"`);
    }
    if (s.arg === "flow") {
      const ids = settings.filter((l) => /^node: /.test(l)).map((l) => l.replace(/^node: /, "").split("|")[0].trim());
      for (const l of s.content) { const at = l.match(/^at: (\S+)/); if (at && !ids.includes(at[1])) errors.push(`flow scene at line ${s.line}: at: ${at[1]} is not a node`); }
    }
    if (s.arg === "meter" && !settings.some((l) => /^zone: \d+/.test(l))) warns.push(`meter scene at line ${s.line}: no zone:`);
    if (s.arg === "photos") {
      const steps = []; for (const l of s.content) { if (/^# /.test(l)) steps.push(0); else if (/^photo: /.test(l) && steps.length) steps[steps.length - 1]++; }
      if (steps.some((n) => n !== 1)) errors.push(`photos scene at line ${s.line}: each step needs exactly one photo: line`);
      for (const l of s.content) { const ph = l.match(/^photo: (\/photos\/[^ |]+)/); if (ph) { try { readFileSync(path.join(path.dirname(file), "..", "..", "public", ph[1])); } catch { errors.push(`photos scene: ${ph[1]} not found under public/`); } } }
    }
  }
  for (const [sec, n] of Object.entries(perSection)) if (n > 1) errors.push(`${n} scenes in section ${sec}`);

  // questions
  const ids = new Set(); const positions = [];
  function question(b) {
    const id = b.arg;
    if (!id || !/^[a-z0-9-]{1,40}$/.test(id)) errors.push(`${b.kind} at line ${b.line}: bad id "${id}"`);
    if (ids.has(id)) errors.push(`duplicate question id ${id}`);
    ids.add(id);
    const optStart = b.content.findIndex((l) => /^- \[[ x]\] /.test(l));
    if (optStart <= 0 || !b.content.slice(0, optStart).some((l) => l.trim())) errors.push(`${b.kind} ${id}: missing prompt`);
    for (const l of b.content.slice(0, Math.max(optStart, 0))) if (/^(- |\* |\d+\. |> |`{3,})/.test(l)) errors.push(`${b.kind} ${id}: prompt line starts with a list/quote/fence marker: "${l.slice(0, 40)}"`);
    const opts = [];
    for (let k = optStart; k < b.content.length && k >= 0; k++) {
      const l = b.content[k];
      const o = l.match(/^- \[([ x])\] (.*)$/);
      if (o) { opts.push({ right: o[1] === "x", text: o[2], fb: [] }); continue; }
      if (/^  > /.test(l) && opts.length) { opts[opts.length - 1].fb.push(l); continue; }
      if (l.trim()) errors.push(`${b.kind} ${id}: unexpected line "${l.slice(0, 50)}"`);
    }
    if (opts.length < 3 || opts.length > 4) errors.push(`${b.kind} ${id}: ${opts.length} options (need 3-4)`);
    const right = opts.filter((o) => o.right);
    if (right.length !== 1) errors.push(`${b.kind} ${id}: ${right.length} [x] (need exactly 1)`);
    for (const [k, o] of opts.entries()) if (!o.fb.length) errors.push(`${b.kind} ${id}: option ${"abcd"[k]} has no feedback`);
    if (right.length === 1) {
      const len = (o) => o.text.length;
      const longest = Math.max(...opts.map(len));
      if (len(right[0]) === longest && opts.filter((o) => len(o) === longest).length === 1) errors.push(`${b.kind} ${id}: right answer is the longest option`);
      positions.push("abcd"[opts.indexOf(right[0])]);
    }
    if (opts.some((o) => /all of the above|none of the above/i.test(o.text))) errors.push(`${b.kind} ${id}: all/none of the above`);
  }
  const cps = blocks.filter((b) => b.kind === "checkpoint"); cps.forEach(question);
  if (cps.length < 3 || cps.length > 5) errors.push(`checkpoints: ${cps.length} (need 3-5)`);
  const tests = blocks.filter((b) => b.kind === "test"); tests.forEach(question);
  const [tMin, tMax] = isStart ? [5, 6] : slug === "main-flow" ? [8, 15] : [8, 10];
  if (tests.length < tMin || tests.length > tMax) errors.push(`final test: ${tests.length} questions (need ${tMin}-${tMax})`);
  const nKind = (p) => tests.filter((t) => (t.arg || "").startsWith(p)).length;
  if (!isStart && nKind("scenario-") < 3) errors.push(`final test: ${nKind("scenario-")} scenario- ids (need >=3)`);
  if (!isStart && nKind("spot-") < 2) errors.push(`final test: ${nKind("spot-")} spot- ids (need >=2)`);
  if (!isStart && nKind("sequence-") < 1) errors.push(`final test: ${nKind("sequence-")} sequence- ids (need >=1)`);
  const srcs = blocks.filter((b) => b.kind === "sources");
  if (srcs.length !== 1) errors.push(`sources blocks: ${srcs.length} (need 1)`);
  if (tests.length && srcs.length === 1) {
    const first = tests[0].index, last = tests[tests.length - 1].index;
    if (last - first + 1 !== tests.length) errors.push("test fences are not contiguous");
    const between = blocks.slice(last + 1, srcs[0].index);
    const proseBetween = lines.slice(tests[tests.length - 1].line + tests[tests.length - 1].content.length + 1, srcs[0].line - 1).join("\n").trim();
    if (between.length || srcs[0].index !== last + 1) errors.push("sources must come right after the last test fence");
    if (proseBetween && !/^#{1,6} [^\n]*$/.test(proseBetween)) warns.push(`prose between tests and sources: "${proseBetween.slice(0, 60)}"`);
  }
  for (const s of srcs) {
    const items = s.content.filter((l) => /^[-*] /.test(l));
    if (items.length < 3) errors.push(`sources: ${items.length} items (need >=3)`);
    for (const it of items) {
      if (!/https?:\/\//.test(it)) errors.push(`source without link: ${it.slice(0, 60)}`);
      if (!/\b20\d\d-\d\d-\d\d\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2}, )?20\d\d\b/.test(it)) errors.push(`source without date: ${it.slice(0, 60)}`);
    }
  }
  for (const b of blocks.filter((b) => b.kind === "callout")) if (!CALLOUTS.includes(b.arg)) errors.push(`callout kind "${b.arg}" invalid`);
  const tries = blocks.filter((b) => b.kind === "try");
  if (!tries.length) warns.push("no try block");
  for (const t of tries) if (!/It's working if/i.test(t.content.join("\n"))) errors.push("try block lacks an \"It's working if\" checklist");
  const stories = blocks.filter((b) => b.kind === "site-story");
  if (ORIGINAL.includes(slug) && !stories.length) errors.push("site-story required for original slug");

  // text rules across prose and typed blocks
  const allText = [proseText, ...blocks.filter((b) => b.kind !== "code").map((b) => b.content.join("\n"))].join("\n");
  const lessonNum = allText.match(/\bLessons? \d+/g); if (lessonNum) errors.push(`refers to Lesson numbers: ${[...new Set(lessonNum)].join(", ")}`);
  // Only single-segment names are checked (`/api/comments` is a path); `/mattpocock-skills:<skill>` is the namespaced form.
  for (const mm of allText.matchAll(/`\/([a-z][a-z0-9:-]*)(?:\s[^`]*)?`/g)) {
    let name = mm[1];
    if (name.startsWith("mattpocock-skills:")) { name = name.slice("mattpocock-skills:".length); if (!SKILLS.includes(name)) errors.push(`namespaced /mattpocock-skills:${name} is not a 1.3.1 Skill`); continue; }
    if (!SKILLS.includes(name) && !BUILTINS.includes(name)) errors.push(`backticked /${name} is not a 1.3.1 Skill or known Built-in command`);
  }
  if (/`\/learn`/.test(allText)) errors.push("bare backticked /learn; write /learn/ or a real link");
  for (const mm of allText.matchAll(/==([^=\n]+)==/g)) if (/^\s|\s$/.test(mm[1])) errors.push(`highlight with inner spaces: ==${mm[1]}==`);
  const hlPerSection = {}; let sec2 = "(intro)";
  for (const l of prose) { if (/^## /.test(l)) sec2 = l; hlPerSection[sec2] = (hlPerSection[sec2] || 0) + (l.match(/==[^=\n]+==/g) || []).length; }
  for (const [s, n] of Object.entries(hlPerSection)) if (n > 3) warns.push(`${n} highlights in ${s}`);
  if (/\b(quiz|quizzes)\b/i.test(allText)) warns.push('uses "quiz"');
  if (/\bthe test\b|\bTest\b(?! ?-)/.test(allText.replace(/Final test/g, ""))) warns.push('possible bare "Test"');
  const known = (process.env.LINT_SLUGS || "").split(",").filter(Boolean);
  const siblings = known.length ? known : readdirSync(path.dirname(file)).filter((f) => f.endsWith(".md")).map((f) => { const h = readFileSync(path.join(path.dirname(file), f), "utf8").match(/\nslug: (.*)\n/); return h ? h[1].trim() : null; }).filter(Boolean);
  for (const link of allText.matchAll(/\(\/learn\/([a-z0-9-]+)[)#]/g)) if (!siblings.includes(link[1])) errors.push(`links to /learn/${link[1]}, which isn't a slug on this branch`);

  return { errors, warns, stats: { slug, proseWords, goals: goals[0]?.content.filter((l) => /^[-*] /.test(l)).length, scenes: scenes.map((s) => s.arg).join(","), checkpoints: cps.length, tests: tests.length, positions: positions.join("") } };
}

let failed = 0;
for (const f of process.argv.slice(2)) {
  const { errors, warns, stats } = lint(f);
  console.log(`\n== ${path.basename(f)}  ${JSON.stringify(stats)}`);
  for (const e of errors) console.log(`  ERROR ${e}`);
  for (const w of [...new Set(warns)]) console.log(`  warn  ${w}`);
  if (errors.length) failed++;
}
process.exit(failed ? 1 : 0);
