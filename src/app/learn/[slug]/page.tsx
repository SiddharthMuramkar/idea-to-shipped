import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonCard } from "@/app/lesson-card";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";
import { lessons, type Lesson } from "@/lessons/lessons";
import type { LessonContext } from "./blocks";
import { Discussion } from "./discussion";
import { LessonIntro, LessonSection } from "./section";

export async function generateStaticParams() {
  return (await lessons.listLessons()).map(({ slug }) => ({ slug }));
}

async function loadLesson(slug: string) {
  "use cache";
  return lessons.getLesson(slug);
}

// Header-only summaries of the whole course, to know whether it has Parts yet.
async function loadCourse() {
  "use cache";
  return lessons.listLessons();
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const lesson = await loadLesson((await params).slug);
  return { title: lesson ? `${lesson.title} · Idea to Shipped` : "Not found" };
}

// Previous/Next sit two to a row at text width, one per row on phones.
const NEIGHBOUR_SIZES = "(max-width: 640px) 100vw, (max-width: 860px) 50vw, 380px";

// Numbers each Checkpoint in reading order, for "Checkpoint 2 of 5".
function checkpointNumbers(lesson: Lesson): Map<string, number> {
  const numbers = new Map<string, number>();
  for (const block of [lesson.intro, ...lesson.sections.map((s) => s.blocks)].flat()) {
    if (block.type === "checkpoint") numbers.set(block.question.id, numbers.size + 1);
  }
  return numbers;
}

// A cached Server Component: it never reads cookies, so every Lesson page
// is static. What a Visitor has done (Comments, and later Answers) arrives
// through the client components' own requests.
export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();

  const ctx: LessonContext = { slug: lesson.slug, checkpoints: checkpointNumbers(lesson) };
  // Like the home page's grid, the Part shows only once every Lesson has one.
  const showPart = lesson.part !== null && (await loadCourse()).every((l) => l.part !== null);
  // Sections are numbered "01", "02", … in order; the Final test's band has
  // no number of its own.
  const numbered = lesson.sections.filter((s) => !s.blocks.some((block) => block.type === "finalTest"));

  return (
    <>
      <Reveal />
      <PhotoBand as="header" className="lesson-hero" image={lesson.image} imageAlt={lesson.imageAlt}>
        <p className="eyebrow lesson-eyebrow">
          {showPart && lesson.part && (
            <span>
              Part {lesson.part.number} · {lesson.part.title}
            </span>
          )}
          <span>
            Lesson {lesson.number} · {lesson.minutes} min read
          </span>
        </p>
        <h1>{lesson.title}</h1>
        <PhotoCredit name={lesson.imageCredit} />
      </PhotoBand>

      <div className="lesson" data-lesson={lesson.slug}>
        <article className="lesson-article">
          <LessonIntro blocks={lesson.intro} ctx={ctx} />
          {lesson.sections.map((section) => (
            <LessonSection
              key={section.id}
              section={section}
              number={numbered.indexOf(section) + 1}
              ctx={ctx}
            />
          ))}
        </article>

        <div className="discussion-band">
          <Discussion lesson={lesson.slug} />
        </div>

        {(lesson.previous || lesson.next) && (
          <nav className="prev-next" aria-label="More Lessons" data-reveal-children>
            {lesson.previous && (
              <LessonCard lesson={lesson.previous} label="Previous" sizes={NEIGHBOUR_SIZES} className="prev" />
            )}
            {lesson.next && (
              <LessonCard lesson={lesson.next} label="Next" sizes={NEIGHBOUR_SIZES} className="next" />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
