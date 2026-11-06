import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/app/course-card";
import { CourseProgress, CourseStart } from "@/app/done";
import { LessonCard } from "@/app/lesson-card";
import { courseMinutes, loadCourses, outlineOf, readingTime, toneOf } from "@/app/library";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";
import { courses, type Course, type LessonSummary, type Part } from "@/lessons/lessons";

export async function generateStaticParams() {
  return (await courses.listCourses()).map(({ slug }) => ({ course: slug }));
}

async function loadCourse(slug: string) {
  const list = await loadCourses();
  const at = list.findIndex((course) => course.slug === slug);
  return at === -1 ? null : { list, at, course: list[at] };
}

export async function generateMetadata({ params }: PageProps<"/courses/[course]">): Promise<Metadata> {
  const found = await loadCourse((await params).course);
  if (!found) return { title: "Not found" };
  return { title: found.course.title, description: found.course.description };
}

// The Lesson grid: three cards to a row, then two, then one on phones.
const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";

// The Course's Lessons under a heading per Part, in reading order; a Course
// without Parts is one group with no heading.
function groupsOf(course: Course): { part: Part | null; lessons: LessonSummary[] }[] {
  if (!course.parts) return [{ part: null, lessons: course.lessons }];
  return course.parts.map((part) => ({
    part,
    lessons: course.lessons.filter((lesson) => lesson.part?.number === part.number),
  }));
}

function LessonGrid({ lessons, tone }: { lessons: LessonSummary[]; tone: string }) {
  return (
    <ol className="lesson-grid" data-reveal-children>
      {lessons.map((lesson) => (
        <li key={lesson.slug}>
          <LessonCard lesson={lesson} tone={tone} sizes={CARD_SIZES} withSummary />
        </li>
      ))}
    </ol>
  );
}

// A Course: its photo band with the description, how far the Visitor has
// got and where to go next, then every Lesson as a card, Part by Part.
export default async function CoursePage({ params }: PageProps<"/courses/[course]">) {
  const found = await loadCourse((await params).course);
  if (!found) notFound();
  const { list, at, course } = found;
  const tone = toneOf(list, course.slug);
  const next = list[at + 1] ?? null;
  const count = course.lessons.length;

  return (
    <>
      <Reveal />
      <PhotoBand as="header" className="course-hero" photo={course.photo} tone={tone} numeral={at + 1}>
        <p className="eyebrow">
          Course {at + 1} of {list.length}
        </p>
        <h1>{course.title}</h1>
        <p className="course-hero-lead">{course.description}</p>
        <p className="course-hero-meta">
          {count} {count === 1 ? "Lesson" : "Lessons"} · {readingTime(courseMinutes(course))} of reading
        </p>
        <CourseProgress slugs={course.lessons.map((lesson) => lesson.slug)} />
        <div className="button-row">
          <CourseStart lessons={outlineOf([course])[0].lessons} />
        </div>
        <PhotoCredit photo={course.photo} />
      </PhotoBand>

      <section className="home-section course-lessons" aria-label="Lessons">
        {groupsOf(course).map(({ part, lessons }) =>
          part ? (
            <section
              key={part.number}
              className="part-group"
              id={`part-${part.number}`}
              aria-labelledby={`part-${part.number}-title`}
              data-reveal-children
            >
              <h2 id={`part-${part.number}-title`} className="part-heading">
                <span className="part-number">Part {part.number}</span> {part.title}
              </h2>
              <LessonGrid lessons={lessons} tone={tone} />
            </section>
          ) : (
            <LessonGrid key="all" lessons={lessons} tone={tone} />
          ),
        )}
      </section>

      <section className="band-light next-course" aria-labelledby="next-course">
        <div className="home-section" data-reveal-children>
          <span className="eyebrow">{next ? "Up next" : "The library"}</span>
          <h2 id="next-course">{next ? "The next Course" : "Every Course"}</h2>
          {next ? (
            <div className="next-course-card">
              <CourseCard course={next} number={at + 2} tone={toneOf(list, next.slug)} sizes={CARD_SIZES} />
            </div>
          ) : (
            <p className="section-lead">This is the last Course in the library.</p>
          )}
          <Link href="/#courses" className="button">
            See all the Courses
          </Link>
        </div>
      </section>
    </>
  );
}
