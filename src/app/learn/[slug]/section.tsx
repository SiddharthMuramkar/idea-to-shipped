import { allBlocks, type Block, type Lesson, type Section } from "@/lessons/lessons";
import { BlockView, type LessonContext } from "./blocks";
import { FinalTest } from "./question";

// This file renders a Lesson's body as ONE reading column. For future
// editors/LLMs, the invariants are:
//   - Order: LessonIntro first, then Sections in written (##) order;
//     inside a Section, heading first, then blocks in written order.
//     DOM order is reading order — nothing is reordered, floated into a
//     stage column, or pinned. Scenes sit in-flow where written.
//   - Numbering: only Sections WITHOUT a Final test are numbered
//     ("01", "02", …). See LessonArticle for how `number` is derived.
//   - Dispatch: every block goes through BlockView (blocks.tsx);
//     `finalTest` is the one exception, handled by FinalTestSection here.
// Do not add a second column or reorder blocks without changing the
// parser contract in src/lessons/blocks.ts as well.

// The Section's number as it's shown: "01", "02", …
const numeral = (n: number) => String(n).padStart(2, "0");

// The intro: everything before the first ## heading (the dek line and the
// goals band), in the reading column. Renders nothing when empty. Its
// sceneId (`<slug>--intro--scene`) is passed for uniformity; the parser
// forbids Scenes in the intro, so no Scene should ever claim it.
export function LessonIntro({ blocks, ctx }: { blocks: Block[]; ctx: LessonContext }) {
  if (blocks.length === 0) return null;
  return (
    <div className="lesson-intro">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} ctx={ctx} sceneId={`${ctx.slug}--intro--scene`} />
      ))}
    </div>
  );
}

// The Section holding the Final test renders it as a ruled section in the
// same column; any blocks written after the questions (usually the
// sources) follow it in the column.
//
// Split rule: blocks BEFORE the finalTest block become FinalTest's
// children (rendered inside it, above the questions); blocks AFTER it
// render below in .lesson-after. Both sides keep written order and share
// the Section's sceneId. This Section shows no "01"-style numeral and
// does not consume a number — see LessonArticle.
function FinalTestSection({ section, at, ctx }: { section: Section; at: number; ctx: LessonContext }) {
  const finalTest = section.blocks[at];
  if (finalTest.type !== "finalTest") return null;
  const sceneId = `${section.id}--scene`;
  const after = section.blocks.slice(at + 1);
  return (
    <>
      <FinalTest questions={finalTest.questions} slug={ctx.slug} id={section.id} titleHtml={section.titleHtml}>
        {section.blocks.slice(0, at).map((block, i) => (
          <BlockView key={i} block={block} ctx={ctx} sceneId={sceneId} />
        ))}
      </FinalTest>
      {after.length > 0 && (
        <div className="lesson-after">
          {after.map((block, i) => (
            <BlockView key={i} block={block} ctx={ctx} sceneId={sceneId} />
          ))}
        </div>
      )}
    </>
  );
}

// One ## Section, top to bottom in the reading column: its number as a
// small mono label, its italic heading, then every block in written order
// — prose, its Scene in-flow where it was written, callouts, Checkpoints.
// There is no stage column and nothing pins.
//
// `number` is the 1-based position among numbered Sections only (see
// LessonArticle). If this Section holds the Final test we delegate to
// FinalTestSection and `number` is ignored (it arrives as 0) — that is
// intentional, not a bug to fix. The numeral is decorative
// (aria-hidden); the accessible name comes from the heading via
// aria-labelledby.
export function LessonSection({ section, number, ctx }: { section: Section; number: number; ctx: LessonContext }) {
  const finalAt = section.blocks.findIndex((block) => block.type === "finalTest");
  if (finalAt !== -1) return <FinalTestSection section={section} at={finalAt} ctx={ctx} />;

  const headingId = `${section.id}--heading`;
  const sceneId = `${section.id}--scene`;

  return (
    <section className="lesson-section" id={section.id} data-section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        <span className="section-num" aria-hidden="true">
          {numeral(number)}
        </span>
        <span dangerouslySetInnerHTML={{ __html: section.titleHtml }} />
      </h2>
      {section.blocks.map((block, i) => (
        <BlockView key={i} block={block} ctx={ctx} sceneId={sceneId} />
      ))}
    </section>
  );
}

// Numbers each Checkpoint in reading order, for "Checkpoint 2 of 5".
// Reading order = allBlocks order (intro, then each Section's blocks).
// Keyed by question id; the total is the map's size. Final-test questions
// are NOT Checkpoints and are never counted here.
function checkpointNumbers(lesson: Lesson): Map<string, number> {
  const numbers = new Map<string, number>();
  for (const block of allBlocks(lesson)) {
    if (block.type === "checkpoint") numbers.set(block.question.id, numbers.size + 1);
  }
  return numbers;
}

// The Lesson's text: the intro, then every Section. Sections are numbered
// "01", "02", … in order; the Final test's section has no number of its own.
//
// Numbering, precisely: `numbered` is the subsequence of Sections with
// NO finalTest block, in order. Each Section's number is
// numbered.indexOf(section) + 1, so a Final-test Section gets 0 and the
// Sections after it are NOT shifted — e.g. Sections [A, Final, B] render
// as 01, (unnumbered), 02. Do not "fix" the 0: LessonSection ignores
// `number` on the Final-test path. Checkpoints are numbered separately
// in reading order by checkpointNumbers above ("Checkpoint N of M").
export function LessonArticle({ lesson }: { lesson: Lesson }) {
  const ctx: LessonContext = { slug: lesson.slug, checkpoints: checkpointNumbers(lesson) };
  const numbered = lesson.sections.filter((s) => !s.blocks.some((block) => block.type === "finalTest"));
  return (
    <article className="lesson-article">
      <LessonIntro blocks={lesson.intro} ctx={ctx} />
      {lesson.sections.map((section) => (
        <LessonSection key={section.id} section={section} number={numbered.indexOf(section) + 1} ctx={ctx} />
      ))}
    </article>
  );
}
