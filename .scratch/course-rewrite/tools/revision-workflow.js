export const meta = {
  name: 'course-20-lessons-revision',
  description: 'Review, revise and adversarially check all 20 course Lessons, then a course-wide pass',
  phases: [
    { title: 'Review', detail: 'first review of the 4 Lessons that never had some lenses' },
    { title: 'Revise', detail: 'one agent per Lesson, edits only its own file' },
    { title: 'Check', detail: 'accuracy, reader and quiz checkers try to break each revision' },
    { title: 'Fix', detail: 'apply or decline what the checkers found' },
    { title: 'Course check', detail: 'course-wide consistency and coverage critics' },
    { title: 'Course fix', detail: 'per-Lesson fixes for course-wide issues, then a verifier' },
  ],
}

const REPO = '/Users/Muramkar/code/idea-to-shipped'
const SKILLS_DIR = '~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills'
const LINT_SLUGS = 'start-here,how-agents-work,context-window,skills,grilling,domain-modeling,prototype,spec-and-issues,tdd,implement,code-review,pr-and-ship,main-flow,diagnosing-bugs,triage,wizard,architecture,retro,wayfinder,models-effort-ultracode'
const LESSONS = args.lessons

const COMMON = `You are working on "Idea to Shipped", a Next.js site at ${REPO} (git branch course-20-lessons). Its course is 20 Lessons in content/lessons/, in 4 Parts, teaching Matt Pocock's Claude Code Skills (the mattpocock-skills plugin, version 1.3.1) to Visitors who have never used a coding agent. Use the GLOSSARY.md terms exactly (Lesson, Part, Skill, Scene, Checkpoint, Final test, Site story, Visitor, Built-in command, Main flow, Slug). A Skill is never called a "command"; that word is for Built-in commands.

Ground truth, in trust order:
1. The installed 1.3.1 Skills: ${SKILLS_DIR}/<bucket>/<name>/SKILL.md and the .md files beside it. Each bucket's README.md says which Skills are user-invoked and which model-invoked. The same content is commit 49dd158 of github.com/mattpocock/skills.
2. "Facts the whole course agrees on" in .scratch/course-rewrite/writing-guide.md.
3. Claude Code's official docs (https://code.claude.com/docs/en/...), as of 2026-10-23.
4. The Lesson's research note, .scratch/course-rewrite/research/<slug>.md: cited, but it can be wrong or older. Paths in the review briefs that start with /Users/siddharth/ are from an old machine; use the plugin folder above instead.

Decisions that override the writing guide:
- Site stories cite only facts the repo holds: commits (git log, git show), PR bodies and comments (gh pr view N --repo SiddharthMuramkar/idea-to-shipped --comments), and files at any commit, including the old journal Lessons at commit d21fc2c (git show d21fc2c:content/lessons/<file>) and the .scratch/ notes. Anything only a session log could back up (the research notes mark it [LOG] or LOG: clock times, token counts, what the agent did in a session) is rewritten from a repo fact or cut. Never invent a session or an outcome. A new Slug with no repo material gets no Site story, or one honest line.
- Commands are one per line, never chained with && (Windows PowerShell 5.1 has no &&). The existing chains were already split mechanically; check the prose around them still reads right.
- Links to github.com/mattpocock/skills are pinned to /blob/49dd158d1076134a641b33efb035946536778336/ (or /tree/ for folders); this is done. Any new one uses the same commit. Links to this repo (SiddharthMuramkar/idea-to-shipped) stay on main.
- The machine-translated transcripts of Matt's videos LlgiOCmFG_w, gaDdrDdczO4 and M6mYodf0dJM are not on this machine. Quote those videos only if a text source backs the exact words; otherwise paraphrase.
- Never use \`scene photos\`: the parser rejects it.
- Never write "Lesson <number>". Link by title: [The context window](/learn/context-window).
- Quotes are under 15 words, in quotation marks, attributed, and at most one per source. Everything else is in the author's own words: never copy a SKILL.md sentence of 15 or more words.

Severity scale, shared by every reviewer, checker and fixer:
- high: a reader would learn something false or act on it wrongly (a wrong Skill behaviour, command, file or user-/model-invoked label); a question with no right answer, two defensible right answers, or its answer given away; a Try it exercise that can't work as written; a Site story claim the repo doesn't hold; a copyright breach; a lint failure.
- medium: a term a cold reader meets before it's explained; a claim the cited source doesn't clearly support; a weak distractor or a wording tell; a goal that no Final test question checks; a Checkpoint far from the section it checks; a contradiction with another Lesson or with the course facts.
- low: wording, rhythm, polish.`

const LENS = {
  reader: `Lens "reader": you are a Visitor who has never used a coding agent and barely uses Git or a terminal, on Windows (PowerShell 5.1) or macOS. Read the Lesson top to bottom as that person. Find: terms used before they are explained (each needs a clause at first use, even if an earlier Lesson defines it: Claude Code, agent, Skill, token, session, repo, spec, ticket, context window, any mode); steps you could not follow; a Try it exercise that would not work from zero (assume only Claude Code installed, the plugin installed, a terminal); contradictions inside the Lesson; repetition that wastes the word budget; Checkpoints that are not right after the section they check; Scenes that disagree with the prose.`,
  quiz: `Lens "quiz": check every Checkpoint and Final test question. For each: is there exactly one defensible right answer, using only what the Lesson teaches? Could a sharp reader argue for a distractor? Is a distractor obviously silly, or about a retired Skill the Lesson never mentions? Wording tells: does the right option echo the prompt or the Lesson's defining phrase; do the wrong options share a phrasing the right one lacks; is the right one the longest, the most hedged or the most specific? Does it test transfer (a fresh situation) rather than recall of the body's own sentence? Does every goal get at least one Final test question? Does a Checkpoint duplicate a Final test question? Are right answers spread across a/b/c/d? Does each option's feedback say why? Is the mix right (3+ scenario-, 2+ spot-, 1+ sequence- ids, except start-here), and does every spot- question really contain one mistake to spot? Check answer keys that depend on Skill behaviour against the 1.3.1 SKILL.md files.`,
  'acc-skills': `Lens "acc-skills": check every claim about a Skill (what it does, asks, writes, which files it reads or creates, when it stops, who can start it, which Skills it calls, its name) against the installed 1.3.1 SKILL.md and sibling files. Check Scenes, Try it steps and answer keys that depend on Skill behaviour too. Quote the SKILL.md path:line as evidence. Flag anything from GitHub main or newer than 1.3.1 presented as 1.3.1, user-/model-invoked mistakes, and copied SKILL.md sentences of 15+ words.`,
  'acc-sources': `Lens "acc-sources": check every claim attributed to a source other than the SKILL.md files: what Matt said or did (videos, aihero.dev pages, newsletters), Claude Code facts (official docs at code.claude.com/docs, as of 2026-10-23), other developers' habits, and the Site story (against the repo: git log, gh pr view, files at commit d21fc2c). Open the sources: load WebFetch (or the firecrawl or tavily tools) with ToolSearch; use gh for GitHub. Check quotes are verbatim, under 15 words and one per source; check the dates in the sources block; check the links resolve. For the three machine-translated videos (LlgiOCmFG_w, gaDdrDdczO4, M6mYodf0dJM), flag direct quotes that no text source backs. Flag every Site story claim that only a session log could back.`,
  accuracy: `Lens "accuracy": check every factual claim. First and most, every claim about a Skill (what it does, asks, writes, which files it reads or creates, when it stops, who can start it, which Skills it calls, its name), every Scene, every Try it step and every answer key that depends on Skill behaviour, against the installed 1.3.1 SKILL.md and sibling files; quote path:line as evidence. Then: Claude Code facts against the course facts list in the writing guide (and the official docs if a claim goes beyond it); the Site story against the repo (git log, gh pr view, git show d21fc2c:...), flagging anything only a session log could back; quotes (verbatim where checkable, under 15 words, one per source); copied SKILL.md sentences of 15+ words.`,
}

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          where: { type: 'string' },
          problem: { type: 'string' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'where', 'problem', 'evidence', 'fix'],
      },
    },
  },
  required: ['findings'],
}

const DECLINED = {
  type: 'array',
  items: {
    type: 'object',
    properties: { problem: { type: 'string' }, reason: { type: 'string' } },
    required: ['problem', 'reason'],
  },
}

const REVISED = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    fixed: { type: 'array', items: { type: 'string' } },
    deferred: {
      type: 'array',
      items: {
        type: 'object',
        properties: { severity: { type: 'string' }, lens: { type: 'string' }, problem: { type: 'string' } },
        required: ['severity', 'lens', 'problem'],
      },
    },
    lowsDeferred: { type: 'number' },
    declined: DECLINED,
    words: { type: 'number' },
    lintClean: { type: 'boolean' },
    testsPassed: { type: 'boolean' },
  },
  required: ['summary', 'fixed', 'deferred', 'lowsDeferred', 'declined', 'words', 'lintClean', 'testsPassed'],
}

const FIXED = {
  type: 'object',
  properties: {
    applied: { type: 'array', items: { type: 'string' } },
    declined: DECLINED,
    words: { type: 'number' },
    lintClean: { type: 'boolean' },
    testsPassed: { type: 'boolean' },
  },
  required: ['applied', 'declined', 'words', 'lintClean', 'testsPassed'],
}

const COURSE_ISSUES = {
  type: 'object',
  properties: {
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          where: { type: 'string' },
          problem: { type: 'string' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['slug', 'severity', 'where', 'problem', 'evidence', 'fix'],
      },
    },
  },
  required: ['issues'],
}

const COURSE_FIXED = {
  type: 'object',
  properties: {
    edits: {
      type: 'array',
      items: {
        type: 'object',
        properties: { before: { type: 'string' }, after: { type: 'string' }, why: { type: 'string' } },
        required: ['before', 'after', 'why'],
      },
    },
    declined: DECLINED,
    lintClean: { type: 'boolean' },
    testsPassed: { type: 'boolean' },
  },
  required: ['edits', 'declined', 'lintClean', 'testsPassed'],
}

function onlyThisFile(l) {
  return `You edit ONLY content/lessons/${l.file}. Other agents are editing the other Lesson files at the same time: never edit, create, move or delete any other file, and run no git command that changes anything (no add, commit, stash, checkout, restore, reset, switch). Read-only git (show, log, diff, blame) is fine.`
}

function gates(l) {
  return `Gates (run both until clean; they are the definition of done):
- \`LINT_SLUGS=${LINT_SLUGS} node .scratch/course-rewrite/tools/lint-lesson.mjs content/lessons/${l.file}\` prints no ERROR lines. It also prints the word count.
- \`npx vitest run --project content src/lessons/course.test.ts -t "Lesson ${l.slug} "\` passes, with more than 0 tests run. If it fails on another Lesson's file (that agent is mid-edit) or runs 0 tests, wait a little and rerun; only this Lesson's results count.
The two tools measure "the right answer is not the longest option" differently: the lint counts the raw Markdown, the test counts the text a reader sees. Both must pass, so make the right answer shorter than at least one wrong option by both measures. No option may say "all of the above" or "none of the above". Run both from ${REPO}.`
}

function readFirst(l) {
  const lines = [
    `- the Lesson itself, content/lessons/${l.file};`,
    `- .scratch/course-rewrite/writing-guide.md: voice, shape, questions, the shared facts, and "Lessons from the pilot review" (the overrides above win where they differ);`,
    `- docs/authoring-lessons.md: the block syntax and the course lint (sections 2 to 6);`,
    l.slug === 'grilling' ? null : `- content/lessons/04-grilling.md: the exemplar for voice, depth and structure (read only);`,
    `- the brief .scratch/course-rewrite/review/briefs/${l.slug}.json: what this Lesson must teach;`,
    `- the research note .scratch/course-rewrite/research/${l.slug}.md, and .scratch/course-rewrite/research/_cross-lesson.md;`,
    `- the Part's ticket(s): ${l.tickets.map((t) => `.scratch/course-rewrite/issues/${t}`).join(', ')};`,
    `- the 1.3.1 SKILL.md files (and siblings) of every Skill this Lesson teaches or describes;`,
    l.old ? `- the old journal Lesson, the Site story's main material: git show d21fc2c:content/lessons/${l.old}` : null,
  ]
  return lines.filter(Boolean).join('\n')
}

function idsRule(l) {
  return l.slug === 'grilling'
    ? `This Lesson is published on the live site. Its question ids, the order of each question's options and the [x] positions are frozen: reword prompts, options and feedback only. A question that must ask something new is deleted and replaced with one under a new id.`
    : `Question ids are not published yet, so they may change, but keep an id when its question keeps its meaning; a question that asks something new gets a new id.`
}

function reviewPrompt(l, lens) {
  return `${COMMON}

First review of the Lesson \`${l.slug}\`, content/lessons/${l.file} (Part ${l.part}). This lens has never been run on it. Don't edit any file; read-only commands only.

${LENS[lens]}

Read: the Lesson; the brief .scratch/course-rewrite/review/briefs/${l.slug}.json; the research note .scratch/course-rewrite/research/${l.slug}.md; the writing guide's "Facts the whole course agrees on" and "Questions"; GLOSSARY.md; and the SKILL.md files the Lesson relies on.

Report each problem with severity (scale above), where (the section heading, a short quote, and the line number), problem, evidence (a SKILL.md path:line, a URL with what it says, a git or gh command and its output, or the Lesson's text) and fix (concrete replacement text where possible). Report every high and medium you can evidence; at most 12 lows. Don't pad: an empty list is a fine answer.`
}

function revisePrompt(l, newFindings) {
  const fresh = newFindings.length
    ? `\n- New findings from this run's first review of the lenses ${l.review.join(', ')} (the JSON at the end of this message).`
    : ''
  const old = l.findings
    ? `- .scratch/course-rewrite/review/findings/${l.slug}.json: first-pass findings by lens (${l.findingsLenses}). Each has severity, where (line numbers are from the draft and may have shifted), problem, evidence and fix. A suggested fix is a suggestion: check it against the sources before applying it.`
    : `- No earlier findings file exists for this Lesson.`
  return `${COMMON}

Revise the Lesson \`${l.slug}\`, content/lessons/${l.file} (Part ${l.part}).

${onlyThisFile(l)}

Read first:
${readFirst(l)}

Findings to work through:
${old}${fresh}

What to do:
1. Fix every high, and every medium from the acc-skills and acc-sources lenses. Check each one is real first: the 1.3.1 SKILL.md wins over a finding.
2. Fix reader and quiz mediums where the fix is clear and fits the word budget. Defer the rest, and the lows, unless a fix is one line and obviously right.
3. Apply the overrides above, the Site story rule above all.
4. Lesson-specific: ${l.notes || 'nothing beyond the above.'}
5. Keep the Lesson's shape (writing guide, "Shape"), 3 to 5 Checkpoints each right after the section it checks, and the Final test size. Keep ${l.slug === 'start-here' ? '900 to 1,400' : '1,800 to 3,000 (aim for 2,300 to 2,800)'} words of running text.
6. ${idsRule(l)}
7. Independent checkers will try to break your revision through three lenses afterwards. Pass them now:
${LENS.accuracy}
${LENS.reader}
${LENS.quiz}

${gates(l)}

Return: summary (3 to 6 sentences on what changed), fixed (one line per finding fixed), deferred (every medium you didn't fix, one line each, with its lens), lowsDeferred (how many lows you left), declined (findings you judged wrong, with the evidence), words (from the lint), lintClean, testsPassed.${newFindings.length ? `\n\nNew findings (JSON):\n${JSON.stringify(newFindings)}` : ''}`
}

function checkPrompt(l, lens, round, history, declined) {
  const earlier = round > 1
    ? `\n\nThis is check round ${round}. Earlier rounds raised issues; a fixer applied some and declined others. Check that the fixes held and broke nothing nearby, then look for anything still wrong. Applied so far: ${JSON.stringify(history)}\nDeclined, with the fixer's reason: ${JSON.stringify(declined)}\nDon't re-raise a declined issue unless the reason is wrong; if it is, say why in evidence.`
    : ''
  return `${COMMON}

Independent check of the Lesson \`${l.slug}\`, content/lessons/${l.file} (Part ${l.part}), which was just revised. Your job is to break it: assume the reviser missed things, and find what is still wrong through your lens. Don't edit any file; read-only commands only.

${LENS[lens]}

Read: the Lesson; the writing guide's "Facts the whole course agrees on" and "Questions" (.scratch/course-rewrite/writing-guide.md); GLOSSARY.md; the brief .scratch/course-rewrite/review/briefs/${l.slug}.json; and the 1.3.1 SKILL.md files the Lesson relies on.${earlier}

Report each problem with severity (scale above), where (the section heading, a short quote, and the line number), problem, evidence (a SKILL.md path:line, a URL with what it says, a git or gh command and its output, or the Lesson's text) and fix (concrete replacement text). Report only what you can evidence. Every high and medium; at most 5 lows, the ones that matter most. An empty list is a fine answer.`
}

function fixPrompt(l, issues, round, declined) {
  return `${COMMON}

Fix round ${round} for the Lesson \`${l.slug}\`, content/lessons/${l.file} (Part ${l.part}). Independent checkers found the issues in the JSON at the end of this message in the revised Lesson.

${onlyThisFile(l)}

Read the Lesson, the writing guide (.scratch/course-rewrite/writing-guide.md) and the SKILL.md files each issue depends on.

For each issue, first check it's real: the 1.3.1 SKILL.md and the course facts win over a checker, and checkers can be wrong. Fix every real high. Fix every real medium, unless the fix would break the word budget or another rule; then decline it with the reason. Decline anything wrong, with the evidence. Keep the Lesson's shape and all the rules above. ${idsRule(l)}
Already declined in earlier rounds (don't reopen these unless an issue below gives new evidence): ${JSON.stringify(declined)}

${gates(l)}

Return: applied (one line per issue fixed), declined (with the reason), words (from the lint), lintClean, testsPassed.

Issues (JSON):
${JSON.stringify(issues)}`
}

const serious = (f) => f.severity === 'high' || f.severity === 'medium'
const CHECK_LENSES = ['accuracy', 'reader', 'quiz']
const MAX_ROUNDS = 3

const results = await pipeline(
  LESSONS,
  // Review: only the lenses that never ran on this Lesson.
  async (l) => {
    if (!l.review.length) return []
    const runs = await parallel(
      l.review.map((lens) => () =>
        agent(reviewPrompt(l, lens), { label: `review:${l.slug}:${lens}`, phase: 'Review', schema: FINDINGS }).then(
          (r) => (r ? r.findings.map((f) => ({ ...f, lens })) : []),
        ),
      ),
    )
    const all = runs.filter(Boolean).flat()
    log(`${l.slug}: first review found ${all.filter((f) => f.severity === 'high').length} high, ${all.filter((f) => f.severity === 'medium').length} medium`)
    return all
  },
  // Revise.
  async (newFindings, l) => {
    const revised = await agent(revisePrompt(l, newFindings || []), { label: `revise:${l.slug}`, phase: 'Revise', schema: REVISED })
    return { newFindings: newFindings || [], revised }
  },
  // Check, then fix, until a round finds nothing serious or the rounds run out.
  async (prev, l) => {
    if (!prev.revised) return { slug: l.slug, file: l.file, ...prev, rounds: [], open: [], declined: [], lows: [] }
    const declined = [...prev.revised.declined]
    const applied = []
    const rounds = []
    let open = []
    let lows = []
    for (let round = 1; round <= MAX_ROUNDS; round++) {
      const checks = await parallel(
        CHECK_LENSES.map((lens) => () =>
          agent(checkPrompt(l, lens, round, applied, declined), {
            label: `check:${l.slug}:${lens}:r${round}`,
            phase: 'Check',
            schema: FINDINGS,
          }).then((r) => (r ? r.findings.map((f) => ({ ...f, lens })) : null)),
        ),
      )
      const issues = checks.filter(Boolean).flat()
      open = issues.filter(serious)
      lows = issues.filter((f) => !serious(f))
      const entry = {
        round,
        high: open.filter((f) => f.severity === 'high').length,
        medium: open.filter((f) => f.severity === 'medium').length,
        low: lows.length,
        checkersFailed: checks.filter((c) => c === null).length,
      }
      rounds.push(entry)
      log(`${l.slug} round ${round}: ${entry.high} high, ${entry.medium} medium, ${entry.low} low`)
      if (!open.length || round === MAX_ROUNDS) break
      const fix = await agent(fixPrompt(l, open, round, declined), { label: `fix:${l.slug}:r${round}`, phase: 'Fix', schema: FIXED })
      if (fix) {
        applied.push(...fix.applied.map((a) => `round ${round}: ${a}`))
        declined.push(...fix.declined)
        entry.fix = { applied: fix.applied.length, declined: fix.declined.length, words: fix.words, lintClean: fix.lintClean, testsPassed: fix.testsPassed }
      }
    }
    return { slug: l.slug, file: l.file, ...prev, rounds, applied, declined, open, lows }
  },
)

const done = results.filter(Boolean)
log(`Per-Lesson pass done for ${done.length} of ${LESSONS.length} Lessons. Starting the course-wide pass.`)

// Course-wide: needs every Lesson's final text, so this is a real barrier.
const COURSE_LENSES = {
  consistency: `Lens "consistency": read all 20 Lessons in content/lessons/ (in order) and find contradictions between them, or with the writing guide's "Facts the whole course agrees on": the Smart zone numbers, the user-invoked and model-invoked lists, the Main flow's order and forks (/retro is step 4), the context hygiene rules (when to /clear, /compact, /handoff), the install command, the Claude Code modes, the /code-review and /prototype name clashes, how a Skill is started, the same Skill or term described differently in two Lessons, two Site stories telling the same event differently, and a Lesson defining a term differently from GLOSSARY.md.`,
  coverage: `Lens "coverage": check the course as a whole. Is every 1.3.1 Skill in the plugin (the 16 user-invoked and 11 model-invoked in the writing guide) taught in the Lesson the writing guide's course table assigns it, and are misc and in-progress Skills only mentioned? Does each Lesson cross-link (/learn/<slug>) the Lessons it builds on, and does every link point at the Lesson that actually covers that topic? Is the same Checkpoint or Final test question (same situation, same answer) repeated across Lessons? Does any Lesson re-teach at length what another Lesson owns, instead of linking to it? Do the Parts and the order follow the Main flow?`,
}

phase('Course check')
const courseRuns = await parallel(
  Object.entries(COURSE_LENSES).map(([name, text]) => () =>
    agent(
      `${COMMON}

Course-wide check of all 20 Lessons, after each was revised and checked on its own. Don't edit any file; read-only commands only.

${text}

Read: every file in content/lessons/; .scratch/course-rewrite/writing-guide.md; .scratch/course-rewrite/spec.md; GLOSSARY.md; and the 1.3.1 SKILL.md files wherever two Lessons disagree, to say which one is right.

Report each problem against the one Lesson (slug) that should change, with severity, where (a short quote and the line number), problem, evidence and fix (concrete replacement text). When two Lessons disagree, name the one that is wrong and quote the source that settles it. Every high and medium; at most 15 lows. An empty list is a fine answer.`,
      { label: `course:${name}`, phase: 'Course check', schema: COURSE_ISSUES },
    ).then((r) => (r ? r.issues.map((i) => ({ ...i, lens: name })) : [])),
  ),
)
const courseIssues = courseRuns.filter(Boolean).flat()
const courseSerious = courseIssues.filter(serious)
log(`Course-wide: ${courseSerious.filter((i) => i.severity === 'high').length} high, ${courseSerious.filter((i) => i.severity === 'medium').length} medium, ${courseIssues.length - courseSerious.length} low`)

phase('Course fix')
const bySlug = {}
for (const issue of courseSerious) (bySlug[issue.slug] = bySlug[issue.slug] || []).push(issue)
const unknownSlugs = Object.keys(bySlug).filter((s) => !LESSONS.some((l) => l.slug === s))
if (unknownSlugs.length) log(`Course issues naming unknown slugs, left for the main session: ${unknownSlugs.join(', ')}`)

const courseFixes = await pipeline(
  LESSONS.filter((l) => bySlug[l.slug]),
  (l) =>
    agent(
      `${COMMON}

Course-wide fixes for the Lesson \`${l.slug}\`, content/lessons/${l.file} (Part ${l.part}). Critics who read all 20 Lessons found the issues in the JSON at the end of this message.

${onlyThisFile(l)}

Read the Lesson, the writing guide, and whatever each issue cites (the other Lesson, the SKILL.md file). For each issue, check it's real first: the 1.3.1 SKILL.md and the course facts win, and critics can be wrong. Fix every real high and every real medium with the smallest edit that works; decline the rest with the reason. ${idsRule(l)}

${gates(l)}

Return: edits (each with the exact before text, the exact after text, and why), declined (with the reason), lintClean, testsPassed.

Issues (JSON):
${JSON.stringify(bySlug[l.slug])}`,
      { label: `course-fix:${l.slug}`, phase: 'Course fix', schema: COURSE_FIXED },
    ),
  (fix, l) => {
    if (!fix || !fix.edits.length) return { slug: l.slug, fix, verify: [] }
    return agent(
      `${COMMON}

Verify the course-wide edits just made to the Lesson \`${l.slug}\`, content/lessons/${l.file}. Don't edit any file; read-only commands only. Each edit's before and after text is in the JSON at the end of this message. For each: is the new text accurate against the 1.3.1 SKILL.md files and the course facts, does it read well for a Visitor who has never used a coding agent, and did it break anything nearby (a question's answer key, a feedback line, a cross-link, the word budget)? Also run the gates and report any failure as a high:
${gates(l)}

Report each problem with severity, where, problem, evidence and fix. Only highs and mediums. An empty list is a fine answer.

Edits (JSON):
${JSON.stringify(fix.edits)}`,
      { label: `course-verify:${l.slug}`, phase: 'Course fix', schema: FINDINGS },
    ).then((v) => ({ slug: l.slug, fix, verify: v ? v.findings : null }))
  },
)

return {
  lessons: done.map((r) => ({
    slug: r.slug,
    file: r.file,
    newFindings: r.newFindings,
    summary: r.revised ? r.revised.summary : 'REVISE AGENT FAILED',
    revise: r.revised
      ? { fixed: r.revised.fixed.length, deferred: r.revised.deferred, lowsDeferred: r.revised.lowsDeferred, declined: r.revised.declined, words: r.revised.words, lintClean: r.revised.lintClean, testsPassed: r.revised.testsPassed }
      : null,
    rounds: r.rounds,
    applied: r.applied,
    declined: r.declined,
    open: r.open,
    lows: r.lows,
  })),
  course: {
    issues: courseIssues,
    fixes: courseFixes.filter(Boolean).map((c) => ({ slug: c.slug, edits: c.fix ? c.fix.edits.length : null, declined: c.fix ? c.fix.declined : null, lintClean: c.fix ? c.fix.lintClean : null, testsPassed: c.fix ? c.fix.testsPassed : null, verify: c.verify })),
    unknownSlugs,
  },
}
