import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonCard } from "@/app/lesson-card";
import { courseHasParts, lessons } from "@/lessons/lessons";
import { Discussion } from "./discussion";
import { LessonArticle } from "./section";

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

// A cached Server Component: it never reads cookies, so every Lesson page
// is static. What a Visitor has done (Comments, and later Answers) arrives
// through the client components' own requests.
//
// The Press header is quiet: kicker, title, then the intro — whose first
// line is set as the dek and whose goals sit in a hairline band (see
// globals.css). There is no photo hero: Press renders no photos, and a
// Lesson header naming one is now an unknown-key build error.
//
// Reading order (for future editors/LLMs — do not reorder casually):
// this page is a single .measure column and DOM order IS reading order:
//   1. <header> — kicker (Part · Lesson · minutes), then <h1> title.
//   2. LessonArticle (section.tsx) — intro, then each ## Section.
//   3. Discussion — after the article, never interleaved with it.
//   4. prev/next <nav> — last, after Discussion.
// There is no sidebar, stage column, or pinned element on this page.
//
// Prev/next rules: `lesson.previous` / `lesson.next` come from
// lessons.getLesson (adjacent by `order`, null at the course ends).
// The <nav> renders only when at least one neighbour exists, and each
// side renders independently — first Lesson shows only Next, last only
// Previous, a one-Lesson course shows no nav. Labels are exactly
// "Previous" / "Next"; classes are `prev` / `next`. Do not compute
// neighbours here; ordering lives in the lessons module.
//
// Kicker Part rule: the Part segment shows only when courseHasParts
// (every Lesson in the course has a Part) AND this Lesson has one.
// Otherwise the kicker is just "Lesson N · M min read".
export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();

  const showPart = courseHasParts(await loadCourse());

  return (
    <div className="measure">
      <header className="lesson-hero">
        <p className="kicker lesson-kicker">
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
      </header>

      <div className="lesson" data-lesson={lesson.slug}>
        <LessonArticle lesson={lesson} />

        <Discussion lesson={lesson.slug} />

        {(lesson.previous || lesson.next) && (
          <nav className="prev-next" aria-label="More Lessons">
            {lesson.previous && <LessonCard lesson={lesson.previous} label="Previous" className="prev" />}
            {lesson.next && <LessonCard lesson={lesson.next} label="Next" className="next" />}
          </nav>
        )}
      </div>
    </div>
  );
}
