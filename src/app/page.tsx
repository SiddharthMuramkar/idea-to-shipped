// Home page — the Press index (course contents page).
//
// Data flow, top to bottom:
//   1. `loadLessons()` returns every Lesson summary in course order
//      (`lessons.listLessons()` — header/front-matter data only).
//   2. `loadOutcomes(slugs)` reads each Lesson's first goal as its
//      one-line outcome (see its note below) into a slug → text Map.
//   3. `byPart(all)` groups those summaries under their Part headings,
//      or returns null so the index renders as one flat list.
//   `Home` then renders the header, the Lesson index (grouped or flat),
//   and the Main flow stages (`FLOW_STEPS`).
//
// Press index rules (see ADR 0008, Press editorial journal):
//   - No hero, no photo bands, no photo cards: Press renders no photos.
//   - Lessons appear only as ruled `LessonCard` entries in an ordered
//     list, grouped by Part when Parts exist (see `lesson-card.tsx`).
//   - Page order is fixed: header (kicker, title, dek, start action,
//     facts) → About → Lessons index → Main flow → closing start action.
import Link from "next/link";
import { LessonCard } from "@/app/lesson-card";
import { courseHasParts, lessons, type LessonSummary, type Part } from "@/lessons/lessons";
import { htmlToText } from "@/lessons/markdown";

// All Lesson summaries in course order. The `"use cache"` wrapper lets
// this file-only read be cached with the page at build time.
async function loadLessons() {
  "use cache";
  return lessons.listLessons();
}

// Each Lesson's outcome line for its index entry: its first goal, as plain
// text. Summaries are header-only, so this reads each Lesson's goals block
// once, at build time (cached with the page). Returns a slug → outcome Map
// holding only non-empty outcomes: a Lesson with no goals block (or an
// empty first goal) is absent from the Map, so its entry renders no
// outcome line — `LessonList` passes `outcomes.get(slug)` straight
// through and `LessonCard` treats a missing outcome as optional.
async function loadOutcomes(slugs: string[]) {
  "use cache";
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      // One bad Lesson body must never fail the whole index: degrade to
      // no outcome line for that Lesson (fleet review P2-2). The text is
      // trimmed so a whitespace-only goal cannot render a blank line.
      let lesson: Awaited<ReturnType<typeof lessons.getLesson>> = null;
      try {
        lesson = await lessons.getLesson(slug);
      } catch {
        lesson = null;
      }
      const goals = lesson?.intro.find((block) => block.type === "goals");
      return [slug, goals ? htmlToText(goals.itemsHtml[0] ?? "").trim() : ""] as const;
    }),
  );
  return new Map(entries.filter(([, outcome]) => outcome !== ""));
}

// The Lessons under a heading per Part, in course order. Returns null
// until every Lesson has a Part (`courseHasParts`), and until then the
// index stays flat — `Home` renders a single `LessonList` instead of
// per-Part groups. When non-null, groups are sorted by Part number and
// each group keeps the incoming course order of its Lessons.
function byPart(all: LessonSummary[]): { part: Part; lessons: LessonSummary[] }[] | null {
  if (!courseHasParts(all)) return null;
  const groups: { part: Part; lessons: LessonSummary[] }[] = [];
  for (const lesson of all) {
    const part = lesson.part!;
    const group = groups.find((g) => g.part.number === part.number);
    if (group) group.lessons.push(lesson);
    else groups.push({ part, lessons: [lesson] });
  }
  return groups.sort((a, b) => a.part.number - b.part.number);
}

// The Main flow, step by step, as the stages below tease it. The Main flow
// Lesson tells the whole story, forks included. Each step links to the
// Lesson that teaches it, once that Lesson exists.
const FLOW_STEPS = [
  {
    skills: ["/grill-with-docs"],
    slug: "grilling",
    title: "Grill the idea",
    text: "Claude questions you until the plan is clear, and writes down the words you agree on.",
  },
  {
    skills: ["/to-spec"],
    slug: "spec-and-issues",
    title: "Write the spec",
    text: "One document says what to build, for whom, and what's out of scope.",
  },
  {
    skills: ["/to-tickets"],
    slug: "spec-and-issues",
    title: "Cut it into tickets",
    text: "The spec becomes small tickets, each one a single session of work.",
  },
  {
    skills: ["/implement", "/implement-spec"],
    slug: "implement",
    title: "Build and review",
    text: "Drive one ticket at a time, or let it run through all of them.",
  },
  {
    skills: ["/pr"],
    slug: "pr-and-ship",
    title: "Open the pull request",
    text: "The agent writes the description when the work goes up for review.",
  },
  {
    skills: ["/retro"],
    slug: "retro",
    title: "Look back",
    text: "Go over the session and improve your setup, so the next build starts better.",
  },
];

// One ruled index list: each Lesson becomes a single `LessonCard` entry
// (see `lesson-card.tsx` for the entry anatomy), looked up in `outcomes`
// by slug. Used both for the flat index and once per Part group.
function LessonList({ lessons: list, outcomes }: { lessons: LessonSummary[]; outcomes: Map<string, string> }) {
  return (
    <ol className="lesson-list">
      {list.map((l) => (
        <li key={l.slug}>
          <LessonCard lesson={l} outcome={outcomes.get(l.slug)} />
        </li>
      ))}
    </ol>
  );
}

// The journal's contents page: title, dek and a start action, then every
// Lesson as a ruled entry grouped by Part, then the Main flow as stages.
// No hero photo, no bands, no photo cards: Press renders no photos, and
// the home photo data was removed with them. Section order in the JSX
// below mirrors the module note at the top of this file; do not insert
// hero or band sections between them.
export default async function Home() {
  const all = await loadLessons();
  const first = all[0];
  const parts = byPart(all);
  const outcomes = await loadOutcomes(all.map((l) => l.slug));
  const slugs = new Set(all.map((l) => l.slug));
  const totalMinutes = all.reduce((sum, l) => sum + l.minutes, 0);

  return (
    <div className="measure">
      <header className="home-head">
        <p className="kicker">A free course in agentic coding</p>
        <h1>From idea to shipped, one Skill at a time.</h1>
        <p className="dek">
          A small course on Matt Pocock&apos;s Skills, written as a journal
          while building this very site: what I typed, and what happened.
        </p>
        {first && (
          <div className="home-start">
            <Link href={`/learn/${first.slug}`} className="button">
              Start with Lesson {first.number}
            </Link>
            <p className="home-start-note">
              Read them in order, or jump to the Skill you need. Each Lesson
              ends with what really happened.
            </p>
          </div>
        )}
        <ul className="home-facts">
          <li>
            <strong>{all.length}</strong> Lessons
          </li>
          {parts && (
            <li>
              <strong>{parts.length}</strong> Parts
            </li>
          )}
          <li>
            <strong>{totalMinutes}</strong> minutes of reading
          </li>
        </ul>
      </header>

      <section id="about" className="home-section" aria-labelledby="about-heading">
        <p className="kicker">About the course</p>
        <h2 id="about-heading">A journal, not a manual.</h2>
        <p>
          Each Lesson teaches one Skill by showing how I used it to build
          this site, from the first grilling to the shipped pull request.
          You see the commands I actually typed and what came back, mistakes
          included.
        </p>
      </section>

      <section id="lessons" className="home-section" aria-labelledby="lessons-heading">
        <p className="kicker">The course</p>
        <h2 id="lessons-heading">Lessons</h2>
        {parts ? (
          parts.map(({ part, lessons: inPart }) => (
            <section
              key={part.number}
              className="part-group"
              aria-labelledby={`part-${part.number}`}
            >
              <div className="part-heading">
                <p className="part-number">Part {part.number}</p>
                <h3 id={`part-${part.number}`}>{part.title}</h3>
              </div>
              <LessonList lessons={inPart} outcomes={outcomes} />
            </section>
          ))
        ) : (
          <LessonList lessons={all} outcomes={outcomes} />
        )}
      </section>

      <section id="flow" className="home-section" aria-labelledby="flow-heading">
        <p className="kicker">Which Skill, when</p>
        <h2 id="flow-heading">The main flow</h2>
        <p>
          Most work takes the same path through the Skills, from idea to
          shipped.
        </p>
        <ol className="flow-steps">
          {FLOW_STEPS.map((step) => (
            <li key={step.title} className="flow-step">
              <p className="flow-step-when">
                {step.skills.map((c, j) => (
                  <span key={c}>
                    {j > 0 && " or "}
                    <code>{c}</code>
                  </span>
                ))}
              </p>
              <h3>
                {slugs.has(step.slug) ? (
                  <Link href={`/learn/${step.slug}`} className="flow-step-link">
                    {step.title}
                  </Link>
                ) : (
                  step.title
                )}
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="flow-note">
          A question that talking can&apos;t settle? Build a throwaway{" "}
          <code>/prototype</code> first. A small job that fits in one session?
          Go from grilling straight to <code>/implement</code>.
        </p>
        <p>
          <Link href="/learn/main-flow">See the main flow</Link>
        </p>
      </section>

      <section id="start" className="home-section" aria-labelledby="start-heading">
        <p className="kicker">Your turn</p>
        <h2 id="start-heading">Got an idea? Ship it.</h2>
        <p>Start at the beginning and follow along, one Skill at a time.</p>
        {first && (
          <div className="home-start">
            <Link href={`/learn/${first.slug}`} className="button">
              Start with Lesson {first.number}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
