export const meta = {
  name: 'course-20-lessons-part-review',
  description: 'Two-axis review (Standards + Spec, as in the 1.3.1 code-review Skill) of each of the 4 Parts against main',
  phases: [{ title: 'Review', detail: 'one Standards and one Spec reviewer per Part, read-only' }],
}

// Lean version of HANDOFF step 3: the course critics' quote, Site story and
// cross-Lesson checks are folded into each Part's Standards reviewer, and the
// non-Lesson diff is reviewed in the main session.
const REPO = '/Users/Muramkar/code/idea-to-shipped'
const SKILL = '/Users/Muramkar/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills'
const TRANSCRIPTS = '/Users/siddharth/Developer/trying/.handoff/transcripts'
const PARTS = args.parts

const CONTEXT = `You are reviewing "Idea to Shipped", a Next.js site at ${REPO} (branch course-20-lessons). Its course is 20 Lessons in content/lessons/, in 4 Parts, teaching Matt Pocock's Claude Code Skills (the mattpocock-skills plugin, version 1.3.1, installed at ${SKILL}/<bucket>/<name>/SKILL.md) to Visitors who have never used a coding agent. The diff is Markdown content, not code. Don't edit any file; read-only commands only. Put any scratch file in a temp dir (mktemp -d), never inside the repo.

Severity scale:
- high: a reader would learn something false or act on it wrongly (a wrong Skill behaviour, command, file or user-/model-invoked label); a question with no right answer, two defensible right answers, or its answer given away; a Try it exercise that can't work as written; a Site story claim the repo doesn't hold; a copyright breach; a lint failure.
- medium: a term a cold reader meets before it's explained; a claim the cited source doesn't clearly support; a weak distractor or a wording tell; a goal that no Final test question checks; a Checkpoint far from the section it checks; a contradiction with another Lesson or with the course facts.
- low: wording, rhythm, polish.

Each Lesson has already been through independent accuracy, reader and quiz checks and fixes; their records are in .scratch/course-rewrite/review/run-2026-10-24b/<slug>.json (\`declined\` lists issues a fixer rejected, with the reason). Don't re-raise a declined issue unless the reason is wrong; if it is, say why in evidence. Report only what you can evidence, with where (Lesson slug, section heading, a short quote, line number) and a concrete fix. Every high and medium; at most 8 lows for the whole Part. An empty list is a fine answer.`

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          kind: { type: 'string', enum: ['standard', 'smell', 'missing', 'scope-creep', 'wrong'] },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          where: { type: 'string' },
          problem: { type: 'string' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['slug', 'kind', 'severity', 'where', 'problem', 'evidence', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['findings', 'summary'],
}

function diffCmd(p) {
  return `git diff origin/main...HEAD -- ${p.files.map((f) => `content/lessons/${f}`).join(' ')}`
}

function standardsPrompt(p) {
  return `${CONTEXT}

Standards review of Part ${p.part} (${p.slugs.join(', ')}), following the Standards axis of ${SKILL}/engineering/code-review/SKILL.md.

Diff: \`${diffCmd(p)}\` (fixed point origin/main; most files are new, so read each Lesson in full). Commits: \`git log origin/main..HEAD --oneline\`.

Standards sources (the repo's documented rules for Lessons):
- .scratch/course-rewrite/writing-guide.md (voice, shape, questions, "Facts the whole course agrees on")
- .scratch/course-rewrite/contract-v1.md (the authoring contract)
- docs/authoring-lessons.md (block syntax and the course lint)
- GLOSSARY.md (use its terms exactly)
- These decisions, which override the writing guide: Site stories cite only facts the repo holds (commits, PR bodies and comments via gh pr view N --repo SiddharthMuramkar/idea-to-shipped --comments, files at any commit, including the old journal Lessons at commit d21fc2c); commands one per line, never chained with &&; github.com/mattpocock/skills links pinned to commit 49dd158d1076134a641b33efb035946536778336; never "Lesson <number>"; quotes under 15 words, in quotation marks, attributed, at most one per source; never a copied SKILL.md sentence of 15+ words; never \`scene photos\`. Matt's video transcripts are readable in ${TRANSCRIPTS}/: LlgiOCmFG_w and gaDdrDdczO4 exist only as machine translations (.ar.json), so a direct quote from them needs a text source with the exact English words; M6mYodf0dJM has an English transcript (.en.json) to check quotes against.

Also, standing in for the course-wide critics that this run skips:
- contradictions between this Part's Lessons, and with the writing guide's course facts (the Main flow has 4 steps with /retro as step 4; the user-invoked and model-invoked Skill lists; context hygiene: /clear, /compact, /handoff; the install command; how a Skill is started);
- every quote and Site story claim in this Part, checked against its source;
- every /learn/<slug> link points at the Lesson that really covers that topic.

The smell baseline in that SKILL.md is written for code. Apply only the smells that map to prose, as judgement calls: Duplicated Code (the same passage or question in two Lessons), Divergent Change (a section doing two unrelated jobs), Mysterious Name (a heading or id that doesn't say what it holds). Skip anything the course lint (npm run test:content) already enforces.

Report (a) every place the diff breaks a documented standard, citing the file and the rule (kind "standard"), and (b) any prose smell, quoting the passage (kind "smell", always a judgement call). summary: one line, total findings and the worst one.`
}

function specPrompt(p) {
  return `${CONTEXT}

Spec review of Part ${p.part} (${p.slugs.join(', ')}), following the Spec axis of ${SKILL}/engineering/code-review/SKILL.md.

Diff: \`${diffCmd(p)}\` (fixed point origin/main; most files are new, so read each Lesson in full). Commits: \`git log origin/main..HEAD --oneline\`.

Spec: .scratch/course-rewrite/spec.md, plus this Part's ticket(s): ${p.tickets.map((t) => `.scratch/course-rewrite/issues/${t}`).join(', ')}. What each Lesson must teach is in .scratch/course-rewrite/review/briefs/<slug>.json, and the writing guide's course table says which Lesson owns which Skill. Out of scope for this PR, so not missing: quizzes and grading, Scene stepping, the photos Scene, and the README Features section.

Report: (a) requirements the spec or ticket asked for that are missing or partial (kind "missing"); (b) content that wasn't asked for, such as a Lesson re-teaching at length what another Lesson owns (kind "scope-creep"); (c) requirements that look covered but are covered wrongly, including a Skill taught in the wrong Lesson or described against its 1.3.1 SKILL.md (kind "wrong"). Quote the spec or ticket line for each finding. summary: one line, total findings and the worst one.`
}

const results = await parallel(
  PARTS.flatMap((p) => [
    () => agent(standardsPrompt(p), { label: `standards:part${p.part}`, phase: 'Review', schema: FINDINGS }).then((r) => ({ part: p.part, axis: 'standards', ...(r || { findings: null, summary: 'REVIEWER FAILED' }) })),
    () => agent(specPrompt(p), { label: `spec:part${p.part}`, phase: 'Review', schema: FINDINGS }).then((r) => ({ part: p.part, axis: 'spec', ...(r || { findings: null, summary: 'REVIEWER FAILED' }) })),
  ]),
)

for (const r of results.filter(Boolean)) {
  const f = r.findings || []
  log(`Part ${r.part} ${r.axis}: ${f.filter((x) => x.severity === 'high').length} high, ${f.filter((x) => x.severity === 'medium').length} medium, ${f.filter((x) => x.severity === 'low').length} low`)
}
return { reviews: results.filter(Boolean) }
