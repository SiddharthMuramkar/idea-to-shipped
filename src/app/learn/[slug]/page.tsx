import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HeaderOverlay } from "@/app/header-overlay";
import { LessonCard } from "@/app/lesson-card";
import { Reveal } from "@/app/reveal";
import { lessons } from "@/lessons/lessons";
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

// Previous/Next sit two to a row in the reading column, one per row on phones.
const NEIGHBOUR_SIZES = "(max-width: 640px) 100vw, (max-width: 860px) 50vw, 420px";

export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = await loadLesson((await params).slug);
  if (!lesson) notFound();

  return (
    <>
      <Reveal />
      {/* The Lesson's photo, full width, under the see-through header. It's the
          first thing on screen, so it loads straight away. */}
      <header className="photo-band lesson-hero" data-hero>
        <HeaderOverlay />
        <div className="photo-band-photo">
          <Image
            src={lesson.image}
            alt={lesson.imageAlt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="photo-band-inner" data-reveal-children>
          <span className="eyebrow">Lesson {lesson.number}</span>
          <h1>{lesson.title}</h1>
          <p className="photo-credit">Photo: {lesson.imageCredit} / Unsplash</p>
        </div>
      </header>

      <div className="lesson-layout">
        <article>
          <div className="prose" data-reveal-children dangerouslySetInnerHTML={{ __html: lesson.html }} />
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
