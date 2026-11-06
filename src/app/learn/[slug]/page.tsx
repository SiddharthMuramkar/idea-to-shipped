import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DonePill } from "@/app/done";
import { LessonCard } from "@/app/lesson-card";
import { lessonAfter, loadCourses, loadLesson, toneOf } from "@/app/library";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";
import { courses } from "@/lessons/lessons";
import { Discussion } from "./discussion";
import { LessonArticle } from "./section";

// Every Lesson of every Course: a Slug is unique across them all.
export async function generateStaticParams() {
  return (await courses.listLessons()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) return { title: "Not found" };
  return { title: lesson.title, description: lesson.summary ?? undefined };
}

// Previous/Next sit two to a row at text width, one per row on phones.
const NEIGHBOUR_SIZES = "(max-width: 640px) 100vw, (max-width: 860px) 50vw, 380px";

// Reads no cookies, so every Lesson page is static: the Comments load in the
// browser, through the Discussion's own request, and so does the Visitor's
// progress (the Done pill, the Final test's banner, the cards' ticks).
export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();
  const list = await loadCourses();
  const course = list.find(({ slug }) => slug === lesson.course.slug)!;
  const tone = toneOf(list, course.slug);
  // After a Course's last Lesson, Next goes on to the next Course.
  const after = lessonAfter(list, lesson);

  return (
    <>
      <Reveal />
      <PhotoBand as="header" className="lesson-hero" photo={lesson.photo} tone={tone} numeral={lesson.number + 1}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={`/courses/${course.slug}`}>{course.title}</Link>
            </li>
            {lesson.part && (
              <li>
                <Link href={`/courses/${course.slug}#part-${lesson.part.number}`}>{lesson.part.title}</Link>
              </li>
            )}
          </ol>
        </nav>
        <h1>{lesson.title}</h1>
        {lesson.summary && <p className="lesson-hero-lead">{lesson.summary}</p>}
        <p className="lesson-meta">
          <span>
            Lesson {lesson.number + 1} of {course.lessons.length}
          </span>
          <span>{lesson.minutes} min read</span>
          <DonePill slug={lesson.slug} />
        </p>
        <PhotoCredit photo={lesson.photo} />
      </PhotoBand>

      <div className="lesson" data-lesson={lesson.slug}>
        <LessonArticle lesson={lesson} next={after?.lesson ?? null} />

        <div className="discussion-band">
          <Discussion slug={lesson.slug} />
        </div>

        {(lesson.previous || after) && (
          <nav className="prev-next" aria-label="More Lessons" data-reveal-children>
            {lesson.previous && (
              <LessonCard
                lesson={lesson.previous}
                tone={tone}
                label="Previous"
                sizes={NEIGHBOUR_SIZES}
                className="prev"
              />
            )}
            {after && (
              <LessonCard
                lesson={after.lesson}
                tone={after.newCourse ? toneOf(list, after.newCourse.slug) : tone}
                label={after.newCourse ? "Next Course" : "Next"}
                sizes={NEIGHBOUR_SIZES}
                className="next"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
