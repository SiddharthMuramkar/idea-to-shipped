import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Art } from "@/app/art";
import { CourseProgress } from "@/app/done";
import { courseMinutes, readingTime } from "@/app/library";
import type { Course } from "@/lessons/lessons";

// A Course as a card on the home page: its photo (or its navy picture),
// "Course N", the title and description, how long it is, and how much of it
// the Visitor has Done.
export function CourseCard({
  course,
  number,
  tone,
  sizes,
}: {
  course: Course;
  number: number;
  tone: string;
  sizes: string;
}) {
  const lessons = course.lessons.length;
  return (
    <Link href={`/courses/${course.slug}`} className="course-card" style={{ "--tone": tone } as CSSProperties}>
      <span className="course-card-photo">
        {course.photo ? (
          <Image src={course.photo.image} alt={course.photo.imageAlt} fill sizes={sizes} />
        ) : (
          <Art tone={tone} numeral={number} />
        )}
      </span>
      <span className="course-card-body">
        <span className="eyebrow">Course {number}</span>
        <span className="course-card-title">{course.title}</span>
        <span className="course-card-description">{course.description}</span>
        <span className="course-card-meta">
          {lessons} {lessons === 1 ? "Lesson" : "Lessons"} · {readingTime(courseMinutes(course))}
        </span>
        <CourseProgress slugs={course.lessons.map((lesson) => lesson.slug)} />
      </span>
    </Link>
  );
}
