// Converts every item of the skills Course (/home/user/skills/content) into an
// idea-to-shipped Lesson file (Markdown with typed fences), into a staging dir.
//
//   node convert-skills.mjs <staging-dir>
//
// Output: <staging-dir>/<track>/<id>.md, plus <staging-dir>/report.json
// (anchors that could not be placed, question counts).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { marked } from "marked";

const ROOT = "/home/user/skills";
const CONTENT = path.join(ROOT, "content");
const SNAP = path.join(ROOT, "snapshot");
const out = process.argv[2];
if (!out) throw new Error("usage: node convert-skills.mjs <staging-dir>");

const SOURCES = JSON.parse(fs.readFileSync(path.join(SNAP, "SOURCES.json"), "utf8"));

// Item links -> /learn/<slug>. Merged basics topics point at the lesson that absorbed them.
const MERGED = {
  "starting-work": "branches-and-worktrees",
  "reading-an-issue": "issues-and-keeping-track",
  "keeping-track": "issues-and-keeping-track",
  "opening-a-pull-request": "pull-requests",
  "pull-requests-and-merging": "merging-and-cleaning-up",
  "your-flow-on-github": "working-with-an-agent-on-github",
  "two-sessions-at-once": "working-with-an-agent-on-github",
  "when-it-goes-wrong": "undo-and-conflicts",
  "seeing-the-architecture": "reading-a-repository",
  "ci-cd": "what-ci-cd-is",
};
const slugFor = (kind, id) => (kind === "basics" && MERGED[id]) || id;
function mapLinks(text) {
  return text.replace(/\]\((skill|principle|basics):([a-z0-9-]+)\)/g, (_, kind, id) => `](/learn/${slugFor(kind, id)})`);
}

// Plain text of inline Markdown, for finding anchors.
function flatten(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`+/g, "")
    .replace(/\*\*|__/g, "")
    .replace(/(^|[^\w])[*_](?=\S)/g, "$1")
    .replace(/(\S)[*_](?=[^\w]|$)/g, "$1")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
const norm = (s) => flatten(s);

function kebab(id, used) {
  let s = String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (s.length > 40) s = s.slice(0, 40).replace(/-[^-]*$/, "") || s.slice(0, 40);
  let base = s, n = 2;
  while (used.has(s)) s = `${base.slice(0, 37)}-${n++}`;
  used.add(s);
  return s;
}

const oneLine = (s) => mapLinks(String(s).replace(/\s+/g, " ").trim());

function question(kind, id, prompt, options, why) {
  const lines = ["```" + `${kind} ${id}`, oneLine(prompt)];
  for (const o of options) {
    lines.push(`- [${o.right ? "x" : " "}] ${oneLine(o.text)}`);
    if (o.feedback) lines.push(`  > ${oneLine(o.feedback)}`);
  }
  if (why) lines.push(`Why: ${oneLine(why)}`);
  lines.push("```");
  return lines.join("\n");
}

const LEVEL_Q = {
  pick: "Which fits best?",
  order: "What comes next?",
  why: "What's the reason behind this step?",
};

function scenarioQuestion(kind, id, sc) {
  const options = sc.options.map((o) => {
    const name = o.skill ? `\`/${o.skill}\`` : null;
    let feedback;
    if (o.best) feedback = name ? `Right: that's ${name}.` : null;
    else feedback = name ? `That's ${name}. ${o.worse ?? ""}` : o.worse;
    return { text: o.text, right: !!o.best, feedback };
  });
  return question(kind, id, `${sc.situation.trim()} ${LEVEL_Q[sc.level] ?? "What do you do?"}`, options, sc.explanation);
}

function readYaml(file) {
  return fs.existsSync(file) ? YAML.parse(fs.readFileSync(file, "utf8")) ?? [] : [];
}

function splitFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { fm: YAML.parse(m[1]) ?? {}, body: m[2] } : { fm: {}, body: raw };
}

// Snapshot file -> { title, url, author, date } for the Sources list.
const sourceCache = new Map();
function resolveSource(file) {
  if (sourceCache.has(file)) return sourceCache.get(file);
  let res = null;
  const parts = file.split("/");
  if (parts[0] === "skills") {
    const name = parts[1];
    const rest = parts.slice(2).join("/");
    const s = SOURCES.skills?.[name];
    if (s?.skillPath) {
      const dir = path.posix.dirname(s.skillPath);
      res = {
        title: `${name}: ${rest}`,
        url: `https://github.com/mattpocock/skills/blob/${s.commit}/${dir}/${rest}`,
        author: "Matt Pocock's Skills",
      };
    }
  } else if (parts[0] === "web") {
    const p = path.join(SNAP, file);
    if (fs.existsSync(p)) {
      const { fm } = splitFrontMatter(fs.readFileSync(p, "utf8"));
      if (fm.url) res = { title: fm.title || fm.url, url: fm.url, author: fm.author, date: fm.published };
    }
  } else if (parts[0] === "docs") {
    const p = path.join(SNAP, file);
    if (fs.existsSync(p)) {
      const text = fs.readFileSync(p, "utf8");
      const url = /^Address:\s*(\S+)/m.exec(text)?.[1];
      const title = /^Title:\s*(.+)$/m.exec(text)?.[1] || /^#\s+(.+)$/m.exec(text)?.[1];
      if (url) res = { title: title || url, url };
    }
  }
  sourceCache.set(file, res);
  return res;
}

function sourcesBlock(files) {
  const seen = new Set();
  const lines = [];
  for (const f of files) {
    const s = resolveSource(f);
    if (!s || seen.has(s.url) || !s.url.startsWith("https://")) continue;
    seen.add(s.url);
    const title = String(s.title).replace(/[[\]]/g, "").replace(/\s+/g, " ").trim();
    const meta = [s.author, s.date].filter(Boolean).map((x) => String(x).replace(/\s+/g, " ")).join(", ");
    lines.push(`- [${title}](${s.url})${meta ? `, ${meta}` : ""}`);
  }
  return lines.length ? ["```sources", ...lines, "```"].join("\n") : "";
}

const report = {};
fs.mkdirSync(out, { recursive: true });

for (const track of ["basics", "principles", "skills"]) {
  for (const id of fs.readdirSync(path.join(CONTENT, track)).sort()) {
    const dir = path.join(CONTENT, track, id);
    if (!fs.statSync(dir).isDirectory()) continue;
    const { fm, body: rawBody } = splitFrontMatter(fs.readFileSync(path.join(dir, "lesson.md"), "utf8"));
    const margin = readYaml(path.join(dir, "margin-questions.yaml"));
    const checks = readYaml(path.join(dir, "check-questions.yaml"));
    const scenarios = readYaml(path.join(dir, "scenarios.yaml"));
    const cards = readYaml(path.join(dir, "flashcards.yaml"));
    const used = new Set();
    const problems = [];

    // Drop image lines (screenshots from pinned pages aren't openly licensed).
    const body = mapLinks(
      rawBody
        .split("\n")
        .filter((line) => !/^\s*!\[[^\]]*\]\(image:[^)]*\)\s*$/.test(line))
        .join("\n"),
    );

    // Place each margin question after the top-level block holding its anchor.
    const tokens = marked.lexer(body);
    const attached = new Map();
    const flatTokens = tokens.map((t) =>
      t.type === "code" || t.type === "space" ? "" : norm(t.type === "list" || t.type === "blockquote" ? t.raw : t.text ?? t.raw),
    );
    margin.forEach((mq, i) => {
      const anchor = norm(mapLinks(mq.anchor ?? ""));
      let at = flatTokens.findIndex((t) => anchor && t.includes(anchor));
      if (at === -1) {
        problems.push(`margin question ${i + 1}: anchor not found: ${mq.anchor}`);
        // Fall back: after the last token of the short part.
        at = tokens.findIndex((t) => t.type === "heading" && t.depth === 2 && /Going deeper/.test(t.text));
        at = at === -1 ? tokens.length - 1 : at - 1;
      }
      if (!attached.has(at)) attached.set(at, []);
      attached.get(at).push(
        question(
          "checkpoint",
          kebab(`quick-${i + 1}`, used),
          mq.question,
          mq.options.map((o) => ({ text: o.text, right: !!o.right, feedback: o.feedback })),
          mq.explanation,
        ),
      );
    });

    let md = "";
    tokens.forEach((t, i) => {
      md += t.raw;
      const qs = attached.get(i);
      if (qs) {
        md = md.replace(/\n*$/, "\n\n") + qs.join("\n\n") + "\n\n";
      }
    });
    md = md.replace(/\n{3,}/g, "\n\n").trim() + "\n";

    // Final test: Check questions first (short part, then deeper), then
    // Scenarios, at most 10. Extra Scenarios become optional practice.
    const ordered = [...checks.filter((c) => !c.deeper), ...checks.filter((c) => c.deeper)];
    const finalBlocks = ordered.map((c) =>
      question(
        "final-test",
        kebab(c.id, used),
        c.question,
        c.options.map((o) => ({ text: o.text, right: !!o.right, feedback: o.feedback })),
        c.explanation,
      ),
    );
    const practice = [];
    for (const sc of scenarios) {
      if (finalBlocks.length < 10) finalBlocks.push(scenarioQuestion("final-test", kebab(sc.id, used), sc));
      else practice.push(scenarioQuestion("checkpoint", kebab(sc.id, used), sc));
    }

    const citationFiles = [
      ...(fm.citations ?? []),
      ...checks.flatMap((c) => c.citations ?? []),
      ...scenarios.flatMap((c) => c.citations ?? []),
      ...cards.flatMap((c) => c.citations ?? []),
    ].map((c) => c.file);

    let doc = md;
    if (practice.length) doc += `\n## Practice scenarios\n\nOptional practice: more situations like the ones in the final test.\n\n${practice.join("\n\n")}\n`;
    if (cards.length) {
      const pairs = cards.map((c) => `Q: ${oneLine(c.prompt)}\nA: ${oneLine(c.answer)}`).join("\n\n");
      doc += `\n## Remember\n\n\`\`\`flashcards\n${pairs}\n\`\`\`\n`;
    }
    doc += `\n## Final test\n\n${finalBlocks.join("\n\n")}\n`;
    const src = sourcesBlock(citationFiles);
    if (src) doc += `\n${src}\n`;

    const header = `---\ntitle: ${id}\nslug: ${slugFor(track, id)}\n---\n\n`;
    const dest = path.join(out, track, `${id}.md`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, header + doc);
    report[`${track}/${id}`] = {
      margin: margin.length,
      final: finalBlocks.length,
      practice: practice.length,
      flashcards: cards.length,
      problems,
    };
  }
}
fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
const bad = Object.entries(report).filter(([, r]) => r.problems.length);
console.log(`converted ${Object.keys(report).length} items; ${bad.length} with unplaced anchors`);
for (const [k, r] of bad) console.log(k, r.problems.length, r.problems[0]);
