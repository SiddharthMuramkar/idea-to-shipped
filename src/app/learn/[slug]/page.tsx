import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { LessonCard } from "@/app/lesson-card";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";
import { lessons, type Block } from "@/lessons/lessons";
import { Discussion } from "./discussion";

export async function generateStaticParams() {
  return (await lessons.listLessons()).map(({ slug }) => ({ slug }));
}

async function loadLesson(slug: string) {
  "use cache";
  return lessons.getLesson(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const lesson = await loadLesson((await params).slug);
  return { title: lesson ? `${lesson.title} · Idea to Shipped` : "Not found" };
}

// STOPGAP until ticket 03 (page layout + blocks) replaces it: just enough to
// show every block. Prose keeps data-reveal-children so its paragraphs still
// fade in one by one; Scenes and questions are plain placeholders.
function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "prose":
        return <div key={i} data-reveal-children dangerouslySetInnerHTML={{ __html: block.html }} />;
      case "goals":
        return (
          <ul key={i} data-block="goals">
            {block.itemsHtml.map((html, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </ul>
        );
      case "scene":
        return (
          <ol key={i} data-block="scene">
            {block.scene.steps.map((step, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: step.captionHtml }} />
            ))}
          </ol>
        );
      case "checkpoint":
        return <div key={i} data-block="checkpoint" dangerouslySetInnerHTML={{ __html: block.question.promptHtml }} />;
      case "finalTest":
        return (
          <ol key={i} data-block="finalTest">
            {block.questions.map((question) => (
              <li key={question.id} dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
            ))}
          </ol>
        );
      case "callout":
        return <aside key={i} data-block={`callout-${block.tone}`} dangerouslySetInnerHTML={{ __html: block.html }} />;
      case "try":
      case "siteStory":
      case "sources":
        return <aside key={i} data-block={block.type} dangerouslySetInnerHTML={{ __html: block.html }} />;
    }
  });
}

// Previous/Next sit two to a row in the reading column, one per row on phones.
const NEIGHBOUR_SIZES = "(max-width: 640px) 100vw, (max-width: 860px) 50vw, 420px";

export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();

  return (
    <>
      <Reveal />
      <PhotoBand as="header" className="lesson-hero" image={lesson.image} imageAlt={lesson.imageAlt}>
        <span className="eyebrow">Lesson {lesson.number}</span>
        <h1>{lesson.title}</h1>
        <PhotoCredit name={lesson.imageCredit} />
      </PhotoBand>

      <div className="lesson-layout">
        <article>
          <div className="prose" data-reveal-children>
            <Blocks blocks={lesson.intro} />
            {lesson.sections.map((section) => (
              <Fragment key={section.id}>
                <h2 id={section.id} dangerouslySetInnerHTML={{ __html: section.titleHtml }} />
                <Blocks blocks={section.blocks} />
              </Fragment>
            ))}
          </div>
          <nav className="prev-next" aria-label="More Lessons" data-reveal-children>
            {lesson.previous && (
              <LessonCard
                lesson={lesson.previous}
                label="Previous"
                sizes={NEIGHBOUR_SIZES}
                className="prev"
              />
            )}
            {lesson.next && (
              <LessonCard
                lesson={lesson.next}
                label="Next"
                sizes={NEIGHBOUR_SIZES}
                className="next"
              />
            )}
          </nav>
        </article>
        <Discussion lesson={lesson.slug} />
      </div>
    </>
  );
}
