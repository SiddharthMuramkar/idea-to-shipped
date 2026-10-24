export const meta = {
  name: 'course-20-lessons-lean-fix',
  description: 'Lean finish: one seeded fix per Lesson with pending issues (no more check rounds), from the run-2026-10-24b records',
  phases: [{ title: 'Fix', detail: 'apply or decline each Lesson\'s pending issues; lint and course test must pass' }],
}

// Set REPO to the checkout you run this from (on course-20-lessons).
const REPO = '/Users/Muramkar/code/idea-to-shipped'
const SKILLS_DIR = '/Users/Muramkar/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills'
// Each Lesson's history and unfixed issues: applied, declined, pending (see HANDOFF.md).
const SEEDS = `${REPO}/.scratch/course-rewrite/review/run-2026-10-24b`
const TRANSCRIPTS = '/Users/siddharth/Developer/trying/.handoff/transcripts'
const LINT_SLUGS = 'start-here,how-agents-work,context-window,skills,grilling,domain-modeling,prototype,spec-and-issues,tdd,implement,code-review,pr-and-ship,main-flow,diagnosing-bugs,triage,wizard,architecture,retro,wayfinder,models-effort-ultracode'
const LESSONS = args.lessons
const TICKETS = { 1: '03-part-1-foundations.md', 2: '04-part-2-main-flow.md', 3: '05-part-3-when-things-go-wrong.md', 4: '06-part-4-level-up.md' }

const COMMON = `You are working on "Idea to Shipped", a Next.js site at ${REPO} (the course-20-lessons branch). Its course is 20 Lessons in content/lessons/, in 4 Parts, teaching Matt Pocock's Claude Code Skills (the mattpocock-skills plugin, version 1.3.1) to Visitors who have never used a coding agent. Use the GLOSSARY.md terms exactly (Lesson, Part, Skill, Scene, Checkpoint, Final test, Site story, Visitor, Built-in command, Main flow, Slug). A Skill is never called a "command"; that word is for Built-in commands.

Ground truth, in trust order:
1. The installed 1.3.1 Skills: ${SKILLS_DIR}/<bucket>/<name>/SKILL.md and the .md files beside it. Each bucket's README.md says which Skills are user-invoked and which model-invoked. The same content is commit 49dd158 of github.com/mattpocock/skills.
2. "Facts the whole course agrees on" in .scratch/course-rewrite/writing-guide.md.
3. Claude Code's official docs (https://code.claude.com/docs/en/...), as of 2026-10-23.
4. The Lesson's research note, .scratch/course-rewrite/research/<slug>.md: cited, but it can be wrong or older. Plugin paths under /Users/siddharth/.claude/ in the briefs and research notes aren't readable on this machine: use the plugin folder above instead. The transcripts folder below is readable.

Decisions that override the writing guide:
- Site stories cite only facts the repo holds: commits (git log, git show), PR bodies and comments (gh pr view N --repo SiddharthMuramkar/idea-to-shipped --comments), and files at any commit, including the old journal Lessons at commit d21fc2c (git show d21fc2c:content/lessons/<file>) and the .scratch/ notes. Anything only a session log could back up (the research notes mark it [LOG] or LOG: clock times, token counts, what the agent did in a session) is rewritten from a repo fact or cut. Never invent a session or an outcome. A new Slug with no repo material gets no Site story, or one honest line.
- Commands are one per line, never chained with && (Windows PowerShell 5.1 has no &&).
- Links to github.com/mattpocock/skills are pinned to /blob/49dd158d1076134a641b33efb035946536778336/ (or /tree/ for folders). Any new one uses the same commit. Links to this repo (SiddharthMuramkar/idea-to-shipped) stay on main.
- Matt's video transcripts are on this machine, read-only, in ${TRANSCRIPTS}/ (<videoId>.json, some as <videoId>.en.json or <videoId>.ar.json). Use them to check what a Lesson says Matt said or did, with timestamps. Never copy a transcript, or more than one short quote, into the repo. Videos LlgiOCmFG_w and gaDdrDdczO4 exist only as machine translations (.ar.json): quote those two only if a text source backs the exact English words; otherwise paraphrase. M6mYodf0dJM has an English transcript (M6mYodf0dJM.en.json): check quotes from it against that file.
- Never use \`scene photos\`: the parser rejects it.
- Never write "Lesson <number>". Link by title: [The context window](/learn/context-window).
- Quotes are under 15 words, in quotation marks, attributed, and at most one per source. Everything else is in the author's own words: never copy a SKILL.md sentence of 15 or more words.
- Put any scratch file you need in a temp dir (mktemp -d), never inside the repo, and above all never in content/lessons/.

Severity scale, shared by every reviewer, checker and fixer:
- high: a reader would learn something false or act on it wrongly (a wrong Skill behaviour, command, file or user-/model-invoked label); a question with no right answer, two defensible right answers, or its answer given away; a Try it exercise that can't work as written; a Site story claim the repo doesn't hold; a copyright breach; a lint failure.
- medium: a term a cold reader meets before it's explained; a claim the cited source doesn't clearly support; a weak distractor or a wording tell; a goal that no Final test question checks; a Checkpoint far from the section it checks; a contradiction with another Lesson or with the course facts.
- low: wording, rhythm, polish.`

const DECLINED = {
  type: 'array',
  items: {
    type: 'object',
    properties: { problem: { type: 'string' }, reason: { type: 'string' } },
    required: ['problem', 'reason'],
  },
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

function onlyThisFile(l) {
  return `You edit ONLY content/lessons/${l.file}. Other agents are editing the other Lesson files at the same time: never edit, create, move or delete any other file, and run no git command that changes anything (no add, commit, stash, checkout, restore, reset, switch). Read-only git (show, log, diff, blame) is fine.`
}

function gates(l) {
  return `Gates (run both until clean; they are the definition of done):
- \`LINT_SLUGS=${LINT_SLUGS} node .scratch/course-rewrite/tools/lint-lesson.mjs content/lessons/${l.file}\` prints no ERROR lines. It also prints the word count.
- \`npx vitest run --project content src/lessons/course.test.ts -t "Lesson ${l.slug} "\` passes, with more than 0 tests run. If it fails on another Lesson's file (that agent is mid-edit) or runs 0 tests, wait a little and rerun; only this Lesson's results count.
The two tools measure "the right answer is not the longest option" differently: the lint counts the raw Markdown, the test counts the text a reader sees. Both must pass, so make the right answer shorter than at least one wrong option by both measures. No option may say "all of the above" or "none of the above". Run both from ${REPO}.`
}

function idsRule(l) {
  return l.slug === 'grilling'
    ? `This Lesson is published on the live site. Its question ids, the order of each question's options and the [x] positions are frozen: reword prompts, options and feedback only. A question that must ask something new is deleted and replaced with one under a new id.`
    : `Question ids are not published yet, so they may change, but keep an id when its question keeps its meaning; a question that asks something new gets a new id.`
}

function wordBudget(l) {
  return l.slug === 'start-here'
    ? `Word budget: 900 to 1,400 words of running text (the lint's count).`
    : `Word budget: 1,800 to 3,000 words of running text (the lint's count; aim for 2,300 to 2,800). If the Lesson is above 2,850 words, every fix must cut at least as much as it adds.`
}

function seedPath(l) {
  return `${SEEDS}/${l.slug}.json`
}

function history(l, applied, declined) {
  return `This Lesson's history from before a pause is in ${seedPath(l)} (read it with jq or cat): \`applied\` lists the fixes made in earlier check rounds and \`declined\` lists issues a reviser or fixer rejected, each with the reason (either may be empty).${applied.length ? ` Applied in this run so far: ${JSON.stringify(applied)}` : ''}${declined.length ? ` Declined in this run so far: ${JSON.stringify(declined)}` : ''}`
}

function fixPrompt(l, round, issues, fromSeed, applied, declined) {
  const list = fromSeed
    ? `The issues are the \`pending\` array in ${seedPath(l)} (from check round ${round}, run before a pause; line numbers may have shifted a little, and an interrupted fixer may already have applied some of them, so check the Lesson first)${issues.length ? ', plus the ones in the JSON at the end of this message' : ''}.`
    : `The issues are in the JSON at the end of this message.`
  return `${COMMON}

Fix round ${round} for the Lesson \`${l.slug}\`, content/lessons/${l.file} (Part ${l.part}). Independent checkers found issues in the Lesson through the accuracy, reader and quiz lenses. ${list}

${onlyThisFile(l)}

Read the Lesson, the writing guide (.scratch/course-rewrite/writing-guide.md), GLOSSARY.md, the Part's ticket .scratch/course-rewrite/issues/${TICKETS[l.part]}, and the SKILL.md files each issue depends on.

For each issue, first check it's real: the 1.3.1 SKILL.md and the course facts win over a checker, and checkers can be wrong. Fix every real high. Fix every real medium, unless the fix would break the word budget or another rule; then decline it with the reason. Decline anything wrong, with the evidence. Keep the Lesson's shape (writing guide, "Shape"), 3 to 5 Checkpoints each right after the section it checks, the Final test size, and all the rules above. ${idsRule(l)}
${wordBudget(l)}
Lesson-specific rules that still hold: ${l.notes || 'none beyond the above.'}

${history(l, applied, declined)} Don't reopen a declined issue unless an issue gives new evidence.

${gates(l)}

Return: applied (one line per issue fixed), declined (with the reason), words (from the lint), lintClean, testsPassed.${issues.length ? `\n\nIssues (JSON):\n${JSON.stringify(issues)}` : ''}`
}

// Lean finish: a Lesson whose start is a fix, or whose pending holds round 3's
// quiz and reader issues (start.lenses), gets one fixer seeded from its pending
// list. No further check rounds run; the per-Part review comes next.
const TO_FIX = LESSONS.filter((l) => l.start.step === 'fix' || l.start.lenses)
log(`Fixing ${TO_FIX.length} Lessons; skipping ${LESSONS.length - TO_FIX.length} with nothing pending: ${LESSONS.filter((l) => !TO_FIX.includes(l)).map((l) => l.slug).join(', ')}`)

const results = await pipeline(TO_FIX, async (l) => {
  const fix = await agent(fixPrompt(l, l.start.round, [], true, [], []), {
    label: `fix:${l.slug}:r${l.start.round}`,
    phase: 'Fix',
    schema: FIXED,
  })
  log(`${l.slug} fix ${l.start.round}: ${fix ? `${fix.applied.length} applied, ${fix.declined.length} declined, ${fix.words} words, lint ${fix.lintClean ? 'clean' : 'NOT clean'}, tests ${fix.testsPassed ? 'pass' : 'FAIL'}` : 'FAILED'}`)
  return { slug: l.slug, file: l.file, part: l.part, round: l.start.round, fix }
})

return { lessons: results.filter(Boolean), failed: TO_FIX.filter((l, i) => !results[i] || !results[i].fix).map((l) => l.slug) }
