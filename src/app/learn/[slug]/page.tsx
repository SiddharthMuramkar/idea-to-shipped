import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lessons } from "@/lessons/lessons";

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

export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();

  return (
    <div className="lesson-layout">
      <article>
        <header className="lesson-band">
          <span>Lesson {lesson.number}</span>
          <h1>{lesson.title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: lesson.html }} />
        <nav className="prev-next">
          {lesson.previous ? (
            <Link href={`/learn/${lesson.previous.slug}`}>
              ← Lesson {lesson.previous.number}: {lesson.previous.title}
            </Link>
          ) : (
            <span />
          )}
          {lesson.next && (
            <Link href={`/learn/${lesson.next.slug}`}>
              Lesson {lesson.next.number}: {lesson.next.title} →
            </Link>
          )}
        </nav>
      </article>
      <aside className="discussion">
        <h3>Discussion</h3>
        <p className="muted">Comments are coming soon.</p>
      </aside>
    </div>
  );
}
