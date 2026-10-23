import type { CSSProperties } from "react";
import type { Block, Section } from "@/lessons/lessons";
import { BlockView, type LessonContext } from "./blocks";
import { FinalTest } from "./question";

// The Section's number as it's shown: "01", "02", …
const numeral = (n: number) => String(n).padStart(2, "0");

// The intro: everything before the first ## heading (goals, opening prose),
// one column at text width.
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
// width.
function FinalTestSection({ section, at, ctx }: { section: Section; at: number; ctx: LessonContext }) {
  const test = section.blocks[at];
  if (test.type !== "finalTest") return null;
  const sceneId = `${section.id}--scene`;
  const after = section.blocks.slice(at + 1);
  return (
    <>
      <FinalTest questions={test.questions} slug={ctx.slug} id={section.id} titleHtml={section.titleHtml}>
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
// right a stage that pins while the Section scrolls by and is pushed away by
// the next one. The stage shows the Section's Scene; with no Scene, a large
// outline numeral, with the Section's big-idea callout under it if it has
// one. Below 1080px it's one column: a Scene's stage pins above its own
// captions, and the numeral isn't shown.
//
// Every text block is its own grid item in the left column, one row each.
// The stage spans all of those rows plus a last, flexible one, which takes
// up any height the stage needs beyond the text's (--rows counts the text
// rows). The stage stays where it was written in the HTML, so on phones it
// sits right above its captions without being copied.
export function LessonSection({ section, number, ctx }: { section: Section; number: number; ctx: LessonContext }) {
  const finalAt = section.blocks.findIndex((block) => block.type === "finalTest");
  if (finalAt !== -1) return <FinalTestSection section={section} at={finalAt} ctx={ctx} />;

  const { blocks } = section;
  const hasScene = blocks.some((block) => block.type === "scene");
  const ideaAt = hasScene ? -1 : blocks.findIndex((block) => block.type === "callout" && block.tone === "big-idea");
  const headingId = `${section.id}--heading`;
  const sceneId = `${section.id}--scene`;
  const rows = 1 + blocks.length - (ideaAt === -1 ? 0 : 1);

  return (
    <section
      className={`lesson-section lesson-section--${hasScene ? "scene" : ideaAt === -1 ? "numeral" : "idea"}`}
      id={section.id}
      data-section
      style={{ "--rows": rows } as CSSProperties}
    >
      <h2 id={headingId} className="section-title" data-reveal>
        <span className="section-num" aria-hidden="true">
          {numeral(number)}
        </span>
        <span dangerouslySetInnerHTML={{ __html: section.titleHtml }} />
      </h2>
      {!hasScene && ideaAt === -1 && (
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
