import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonCard } from "@/app/lesson-card";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";
import { courses } from "@/lessons/lessons";
import { Discussion } from "./discussion";
import { LessonArticle } from "./section";

// Every Lesson of every Course: a Slug is unique across them all.
export async function generateStaticParams() {
  return (await courses.listLessons()).map(({ slug }) => ({ slug }));
}

async function loadLesson(slug: string) {
  "use cache";
  return courses.getLesson(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const lesson = await loadLesson((await params).slug);
  return { title: lesson ? `${lesson.title} · Idea to Shipped` : "Not found" };
}

// Previous/Next sit two to a row at text width, one per row on phones.
const NEIGHBOUR_SIZES = "(max-width: 640px) 100vw, (max-width: 860px) 50vw, 380px";

// A cached Server Component: it never reads cookies, so every Lesson page
// is static. What a Visitor has done (Comments, and later Answers) arrives
// through the client components' own requests.
export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();

  return (
    <>
      <Reveal />
      <PhotoBand as="header" className="lesson-hero" photo={lesson.photo}>
        <p className="eyebrow lesson-eyebrow">
          {lesson.part && (
            <span>
              Part {lesson.part.number} · {lesson.part.title}
            </span>
          )}
          <span>
            Lesson {lesson.number} · {lesson.minutes} min read
          </span>
        </p>
        <h1>{lesson.title}</h1>
        <PhotoCredit photo={lesson.photo} />
      </PhotoBand>

      <div className="lesson" data-lesson={lesson.slug}>
        <LessonArticle lesson={lesson} />

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
