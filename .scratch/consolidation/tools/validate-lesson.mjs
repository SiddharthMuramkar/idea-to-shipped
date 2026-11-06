// Standalone checker for the merged site's lesson format (see plan/FORMAT.md).
//   node validate-lesson.mjs <file.md> [...]
// Exits 1 when any file has an error. Warnings don't fail.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import YAML from "yaml";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAP = fs.readFileSync(path.join(HERE, "../plan/course-map.md"), "utf8");
const KNOWN = new Set([...MAP.matchAll(/^- `([a-z0-9-]+)` —/gm)].map((m) => m[1]));
const KINDS = ["goals", "scene", "checkpoint", "final-test", "callout", "try", "site-story", "sources", "flashcards", "diagram"];
const NEAR = { quiz: "checkpoint <id>", question: "checkpoint <id>", test: "final-test <id>", tip: "callout tip", note: "callout tip", remember: "callout remember", "watch-out": "callout watch-out", warning: "callout watch-out", cards: "flashcards", flashcard: "flashcards", mermaid: "diagram", chat: "scene chat", terminal: "scene terminal" };
const TONES = ["tip", "watch-out", "big-idea", "remember"];
const SCENES = ["chat", "terminal", "flow", "files", "meter"];
const DIAGRAMS = ["chain", "compare", "tree", "layers", "git", "cycle"];
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let failed = false;

function checkFile(file) {
  const errors = [];
  const warnings = [];
  const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return report(file, ["missing the --- header"], []);
  const fields = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim()) continue;
    const i = line.indexOf(":");
    if (i === -1) { errors.push(`header line without a colon: ${line}`); continue; }
    fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const isCourse = path.basename(file) === "course.md";
  const allowed = isCourse
    ? ["title", "slug", "description", "order", "image", "imageAlt"]
    : ["title", "slug", "summary", "image", "imageAlt"];
  for (const k of Object.keys(fields)) if (!allowed.includes(k)) errors.push(`unknown header key "${k}" (allowed: ${allowed.join(", ")})`);
  for (const k of ["title", "slug"]) if (!fields[k]) errors.push(`missing header ${k}`);
  if (isCourse && !fields.description) errors.push("missing header description");
  if (!isCourse && !fields.summary) warnings.push("no summary: in the header");
  if (!!fields.image !== !!fields.imageAlt) errors.push("image and imageAlt go together");
  if (fields.slug && !ID.test(fields.slug)) errors.push(`slug "${fields.slug}" isn't kebab-case`);
  if (isCourse) {
    for (const line of m[2].split("\n")) {
      const t = line.trim();
      if (!t) continue;
      const li = /^- ([a-z0-9-]+)$/.exec(t);
      if (li) { if (!fs.existsSync(path.join(path.dirname(file), `${li[1]}.md`))) warnings.push(`lists ${li[1]} but ${li[1]}.md isn't there yet`); }
      else if (!/^## \S/.test(t)) errors.push(`course.md holds only "## Part" and "- slug" lines: ${t}`);
    }
    return report(file, errors, warnings);
  }
  if (fields.slug && path.basename(file, ".md") !== fields.slug) errors.push(`file name must be ${fields.slug}.md`);
  if (fields.slug && !KNOWN.has(fields.slug)) warnings.push(`slug ${fields.slug} isn't in the course map`);

  const tokens = marked.lexer(m[2]);
  let section = null;
  const sections = [];
  const qids = new Set();
  let finalCount = 0;
  let finalOpen = false;
  let finalSeen = false;
  let afterFinal = [];

  const checkInline = (toks, where) => {
    for (const t of toks ?? []) {
      if (t.type === "html") errors.push(`${where}: raw HTML isn't allowed: ${t.raw.trim().slice(0, 60)}`);
      if (t.type === "image") errors.push(`${where}: images aren't allowed in the body (use the header image)`);
      if (t.type === "link") {
        const href = t.href;
        const lm = /^\/learn\/([a-z0-9-]+)$/.exec(href);
        if (lm) { if (!KNOWN.has(lm[1])) errors.push(`${where}: link to unknown lesson /learn/${lm[1]}`); }
        else if (!/^https:\/\//.test(href)) errors.push(`${where}: link must be /learn/<slug> or https:// (got ${href})`);
      }
      if (t.tokens) checkInline(t.tokens, where);
      if (t.items) for (const it of t.items) checkInline(it.tokens, where);
    }
  };
  const lessonNumbers = (text, where) => {
    const hit = /\b(Lesson|Part) \d+\b/.exec(text);
    if (hit) warnings.push(`${where}: says "${hit[0]}": link the lesson by title instead`);
  };

  const questionCheck = (kind, id, body, where) => {
    if (!id) return errors.push(`${where}: ${kind} needs an id`);
    if (!ID.test(id) || id.length > 40) errors.push(`${where}: id "${id}" must be kebab-case, <= 40 chars`);
    if (qids.has(id)) errors.push(`${where}: question id "${id}" used twice`);
    qids.add(id);
    const prompt = [];
    const opts = [];
    let why = "";
    for (const line of body.split("\n")) {
      if (!line.trim()) continue;
      const o = /^- \[([ xX])\] (.+)$/.exec(line);
      const fb = /^\s+> ?(.*)$/.exec(line);
      if (o) opts.push({ right: o[1] !== " ", text: o[2], fb: "" });
      else if (/^Why: /.test(line)) { if (!opts.length) errors.push(`${where}: "Why:" goes after the options`); why = line.slice(5).trim(); }
      else if (fb && opts.length) opts[opts.length - 1].fb += fb[1];
      else if (/^\s+- \[/.test(line) || line.startsWith("- [")) errors.push(`${where}: bad option line: ${line.trim()}`);
      else if (opts.length) errors.push(`${where}: after the options, only feedback ("  > ") and one "Why:" line: ${line.trim().slice(0, 60)}`);
      else if (/^(?:[-*+] |\d+[.)] |>|```|~~~)/.test(line.trimStart())) errors.push(`${where}: the prompt is one paragraph of inline text: ${line.trim().slice(0, 60)}`);
      else prompt.push(line);
    }
    if (!prompt.length) errors.push(`${where}: needs a prompt`);
    if (opts.length < 2 || opts.length > 6) errors.push(`${where}: needs 2 to 6 options (has ${opts.length})`);
    if (opts.filter((o) => o.right).length !== 1) errors.push(`${where}: needs exactly one [x] option`);
    if (!why && opts.some((o) => !o.fb.trim())) errors.push(`${where}: needs a "Why:" line, or feedback under every option`);
    if (opts.some((o) => /\b(all|none) of the above\b/i.test(o.text))) errors.push(`${where}: no "all/none of the above"`);
    if (kind === "final-test" && opts.length < 3) warnings.push(`${where}: final-test questions should have 3-4 options`);
    for (const o of opts) checkInline(marked.lexer(o.text), where);
    checkInline(marked.lexer(prompt.join(" ")), where);
  };

  const walkNested = (toks, where) => {
    for (const t of toks ?? []) {
      if (t.type === "code" && t.lang && KINDS.includes(t.lang.split(/\s+/)[0])) errors.push(`${where}: typed block \`${t.lang}\` must be at the top level, not inside a list or quote`);
      if (t.items) for (const it of t.items) walkNested(it.tokens, where);
      if (t.type === "blockquote") walkNested(t.tokens, where);
    }
  };

  for (const t of tokens) {
    const where = section ? `"${section.title}"` : "intro";
    if (t.type === "space") continue;
    if (t.type === "heading") {
      if (t.depth === 1) errors.push(`no # headings (use ##): ${t.text}`);
      if (t.depth >= 4) errors.push(`nothing deeper than ###: ${t.text}`);
      if (t.depth === 2) {
        if (finalSeen) errors.push(`"## ${t.text}" comes after the Final test: the Final test is the last ## part`);
        section = { title: t.text };
        sections.push(section);
        finalOpen = false;
      }
      checkInline(t.tokens, where);
      lessonNumbers(t.text, where);
      continue;
    }
    if (t.type === "html") { errors.push(`${where}: raw HTML isn't allowed: ${t.raw.trim().slice(0, 60)}`); continue; }
    if (t.type === "code" && t.lang) {
      const [word, ...args] = t.lang.trim().split(/\s+/);
      if (!KINDS.includes(word)) {
        if (NEAR[word.toLowerCase()]) errors.push(`${where}: "${word}" isn't a block kind: did you mean "${NEAR[word.toLowerCase()]}"?`);
        if (finalSeen) afterFinal.push("code");
        continue;
      }
      if (word !== "final-test" && word !== "sources" && finalSeen) errors.push(`${where}: only a sources block may follow the final-test questions`);
      if (word !== "final-test") finalOpen = false;
      switch (word) {
        case "goals":
          if (section) errors.push("goals go before the first ## heading");
          if (!/^\s*- /m.test(t.text)) errors.push("goals: write the goals as a Markdown list");
          break;
        case "callout":
          if (!TONES.includes(args[0])) errors.push(`${where}: callout tone must be ${TONES.join(", ")}`);
          checkInline(marked.lexer(t.text), where);
          break;
        case "scene":
          if (!SCENES.includes(args[0])) errors.push(`${where}: scene type must be ${SCENES.join(", ")}`);
          if (!section) errors.push("scenes go in a ## part, not the intro");
          break;
        case "flashcards": {
          const pairs = t.text.split(/\n\s*\n/).filter((p) => p.trim());
          if (!pairs.length) errors.push(`${where}: flashcards block is empty`);
          for (const p of pairs) if (!/^Q: .+\nA: .+$/s.test(p.trim()) || p.trim().split("\n").length !== 2) errors.push(`${where}: each flashcard is a "Q: …" line then an "A: …" line: ${p.trim().slice(0, 60)}`);
          break;
        }
        case "diagram": {
          try {
            const d = YAML.parse(t.text);
            if (!DIAGRAMS.includes(d?.type)) errors.push(`${where}: diagram type must be ${DIAGRAMS.join(", ")}`);
            if (!d?.caption) errors.push(`${where}: diagram needs a caption`);
          } catch (e) { errors.push(`${where}: diagram YAML doesn't parse: ${e.message.split("\n")[0]}`); }
          break;
        }
        case "sources":
          for (const line of t.text.split("\n").filter((l) => l.trim())) if (!/^- \[[^\]]+\]\(https:\/\/[^)]+\)/.test(line)) errors.push(`sources: each line is "- [Title](https://…)…": ${line.slice(0, 60)}`);
          break;
        case "checkpoint":
          questionCheck(word, args[0], t.text, `${where} checkpoint ${args[0] ?? ""}`);
          break;
        case "final-test":
          questionCheck(word, args[0], t.text, `${where} final-test ${args[0] ?? ""}`);
          if (finalSeen && !finalOpen) errors.push(`final-test blocks must sit together`);
          if (!section) errors.push("the final test goes in a ## Final test part");
          finalSeen = true;
          finalOpen = true;
          finalCount++;
          if (section) section.final = true;
          break;
        default:
          checkInline(marked.lexer(t.text), where);
      }
      continue;
    }
    if (finalSeen) { errors.push(`${where}: only a sources block may follow the final-test questions (found ${t.type})`); continue; }
    finalOpen = false;
    walkNested([t], where);
    checkInline(t.tokens, where);
    if (t.type === "table") for (const row of [t.header, ...t.rows]) for (const cell of row) checkInline(cell.tokens, where);
    lessonNumbers(t.raw, where);
  }
  if (!finalSeen) errors.push("no final test: end the lesson with a ## Final test part of at least 5 final-test blocks");
  else if (finalCount < 5) errors.push(`the final test has ${finalCount} questions: it needs at least 5`);
  const last = sections[sections.length - 1];
  if (finalSeen && (!last?.final || !/^final test$/i.test(last.title))) errors.push(`the last ## part must be "## Final test" holding the final-test blocks`);
  const checkpoints = (m[2].match(/^```checkpoint /gm) ?? []).length;
  if (checkpoints === 0) warnings.push("no checkpoint (quick check) questions in the text");
  return report(file, errors, warnings, { final: finalCount, checkpoints, sections: sections.length });
}

function report(file, errors, warnings, stats = {}) {
  if (errors.length) failed = true;
  const s = Object.entries(stats).map(([k, v]) => `${k}=${v}`).join(" ");
  console.log(`${errors.length ? "FAIL" : "ok  "} ${file} ${s}`);
  for (const e of errors) console.log(`  error: ${e}`);
  for (const w of warnings) console.log(`  warn:  ${w}`);
}

for (const f of process.argv.slice(2)) checkFile(f);
process.exit(failed ? 1 : 0);
