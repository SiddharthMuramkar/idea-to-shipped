import type { CSSProperties } from "react";
import type { Block, Lesson, Section } from "@/lessons/lessons";
import { BlockView, type LessonContext } from "./blocks";
import { FinalTest, type NextLesson } from "./final-test";
import { QuickCheckRail } from "./quick-check-rail";
import { withShuffledOptions } from "./shuffle";

const numeral = (n: number) => String(n).padStart(2, "0");

// The intro: everything before the first ## heading (goals, opening prose).
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

// The Section holding the Final test becomes a navy band of its own; any
// blocks written after the questions (usually the sources) follow it at text
// width. The questions' options are shuffled here, on the server, so their
// order is the same on every visit.
function FinalTestSection({
  section,
  at,
  ctx,
  next,
}: {
  section: Section;
  at: number;
  ctx: LessonContext;
  next: NextLesson;
}) {
  const finalTest = section.blocks[at];
  if (finalTest.type !== "finalTest") return null;
  const sceneId = `${section.id}--scene`;
  const after = section.blocks.slice(at + 1);
  return (
    <>
      <FinalTest
        questions={finalTest.questions.map((question) => withShuffledOptions(question, ctx.slug))}
        slug={ctx.slug}
        id={section.id}
        titleHtml={section.titleHtml}
        next={next}
      >
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

// One ## Section. From 1080px it's a grid: the text on the left, and on the
// right a stage with the Section's Scene or, with no Scene, a large outline
// numeral (with the Section's big-idea callout under it, if it has one) that
// pins while the Section scrolls by. Below 1080px it's one column, and the
// numeral isn't shown.
//
// Every text block is its own grid item in the left column, one row each.
// The stage spans all of those rows plus a last, flexible one, which takes
// up any height the stage needs beyond the text's (--rows counts the text
// rows). The stage stays where it was written in the HTML, so on phones it
// sits right above its captions without being copied.
//
// A Section whose right column holds only the numeral is marked
// data-quick-checks when it has Quick checks: from 1280px, QuickCheckRail
// lifts them into that column, level with their blocks, in the numeral's
// place.
export function LessonSection({ section, number, ctx }: { section: Section; number: number; ctx: LessonContext }) {
  const { blocks } = section;
  const hasScene = blocks.some((block) => block.type === "scene");
  const ideaAt = hasScene ? -1 : blocks.findIndex((block) => block.type === "callout" && block.tone === "big-idea");
  const railFree = !hasScene && ideaAt === -1;
  const hasQuickChecks = blocks.some((block) => block.type === "checkpoint");
  const headingId = `${section.id}--heading`;
  const sceneId = `${section.id}--scene`;
  const rows = 1 + blocks.length - (ideaAt === -1 ? 0 : 1);

  return (
    <section
      className={`lesson-section lesson-section--${hasScene ? "scene" : ideaAt === -1 ? "numeral" : "idea"}`}
      id={section.id}
      data-section
      data-quick-checks={railFree && hasQuickChecks ? "" : undefined}
      style={{ "--rows": rows } as CSSProperties}
    >
      <h2 id={headingId} className="section-title" data-reveal>
        <span className="section-num" aria-hidden="true">
          {numeral(number)}
        </span>
        <span dangerouslySetInnerHTML={{ __html: section.titleHtml }} />
      </h2>
      {railFree && (
        <div className="stage stage--numeral" aria-hidden="true">
          <span className="stage-numeral">{numeral(number)}</span>
        </div>
      )}
      {blocks.map((block, i) =>
        i === ideaAt ? (
          <div key={i} className="stage stage--idea">
            <span className="stage-numeral" aria-hidden="true">
              {numeral(number)}
            </span>
            <BlockView block={block} ctx={ctx} sceneId={sceneId} />
          </div>
        ) : (
          <BlockView key={i} block={block} ctx={ctx} sceneId={sceneId} />
        ),
      )}
    </section>
  );
}

// The Lesson's text: the intro, then every Section. Sections are numbered
// "01", "02", … in order; the Final test's band has no number of its own.
// `next` is where the Final test's "Next lesson" goes: by default the next
// Lesson in the Course.
export function LessonArticle({ lesson, next = lesson.next }: { lesson: Lesson; next?: NextLesson }) {
  const ctx: LessonContext = { slug: lesson.slug };
  const numbered = lesson.sections.filter((s) => !s.blocks.some((block) => block.type === "finalTest"));
  const nextLesson = next && { slug: next.slug, title: next.title };
  return (
    <article className="lesson-article">
      <QuickCheckRail />
      <LessonIntro blocks={lesson.intro} ctx={ctx} />
      {lesson.sections.map((section) => {
        const finalAt = section.blocks.findIndex((block) => block.type === "finalTest");
        return finalAt === -1 ? (
          <LessonSection key={section.id} section={section} number={numbered.indexOf(section) + 1} ctx={ctx} />
        ) : (
          <FinalTestSection key={section.id} section={section} at={finalAt} ctx={ctx} next={nextLesson} />
        );
      })}
    </article>
  );
}
