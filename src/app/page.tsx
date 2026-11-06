import Image from "next/image";
import Link from "next/link";
import { Art } from "@/app/art";
import { CourseCard } from "@/app/course-card";
import { ContinueReading } from "@/app/done";
import { Icon, type IconName } from "@/app/learn/[slug]/icons";
import { loadCourses, loadHomePhotos, outlineOf, toneOf } from "@/app/library";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";

// The Course grid: three cards to a row, then two, then one on phones.
const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";

// The library's front door, and where its Courses link from.
const START_HERE = "start-here";

// How a Lesson works, as the strip under the photo shows it.
const STEPS: { icon: IconName; title: string; note?: string; text: string }[] = [
  {
    icon: "read",
    title: "Read",
    text: "Short Lessons with worked examples, diagrams and real commands to try.",
  },
  {
    icon: "checkpoint",
    title: "Quick checks",
    note: "optional",
    text: "Questions beside the text check each idea as you go. Tap an answer to see why; nothing is saved.",
  },
  {
    icon: "test",
    title: "Final test",
    text: "At least five questions at the end of every Lesson. Your score doesn't matter: taking it is what counts.",
  },
  {
    icon: "done",
    title: "Done",
    text: "The Lesson gets a green tick, and its Course counts it. It's saved in this browser, with no account to make.",
  },
];

export default async function Home() {
  const [list, { hero, cta }] = await Promise.all([loadCourses(), loadHomePhotos()]);
  const lessons = list.flatMap((course) => course.lessons);
  const start = lessons.find((lesson) => lesson.slug === START_HERE) ?? lessons[0];

  return (
    <>
      <Reveal />
      <PhotoBand className="home-hero" photo={hero}>
        <span className="eyebrow">Free · No account needed</span>
        <h1>A free library for building software with coding agents.</h1>
        <p className="home-hero-lead">
          {list.length} Courses and {lessons.length} Lessons, from your first Git commit to shipping
          with Claude Code and Matt Pocock&apos;s Skills. Read a Lesson, try its quick checks, take the
          Final test, and it&apos;s Done.
        </p>
        <div className="button-row">
          <Link href="#courses" className="button button-light">
            Browse the Courses
          </Link>
          {start && (
            <Link href={`/learn/${start.slug}`} className="button button-outline">
              Start here
            </Link>
          )}
        </div>
        <ContinueReading courses={outlineOf(list)} />
        <PhotoCredit photo={hero} />
      </PhotoBand>

      <section className="band-light" aria-labelledby="how-it-works">
        <div className="home-section how-it-works" data-reveal-children>
          <span className="eyebrow">How a Lesson works</span>
          <h2 id="how-it-works">Read it, check it, and it&apos;s Done.</h2>
          <ol className="how-steps" data-reveal-children>
            {STEPS.map((step) => (
              <li key={step.title} className={`how-step how-step--${step.icon}`}>
                <span className="how-step-icon">
                  <Icon name={step.icon} />
                </span>
                <h3>
                  {step.title}
                  {step.note && <span className="how-step-note"> ({step.note})</span>}
                </h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="courses" className="home-section" aria-labelledby="courses-title" data-reveal-children>
        <span className="eyebrow">The library</span>
        <h2 id="courses-title">Courses</h2>
        <p className="section-lead">
          Start with whichever you need. Each Course reads in order, from nothing to doing it yourself.
        </p>
        <ol className="course-grid" data-reveal-children>
          {list.map((course, i) => (
            <li key={course.slug}>
              <CourseCard course={course} number={i + 1} tone={toneOf(list, course.slug)} sizes={CARD_SIZES} />
            </li>
          ))}
        </ol>
      </section>

      {start && (
        <section className="photo-band home-cta" aria-labelledby="home-cta" data-art={cta ? undefined : ""}>
          {cta ? (
            <div className="photo-band-photo">
              <Image src={cta.image} alt={cta.imageAlt} fill sizes="100vw" />
            </div>
          ) : (
            <Art tone="#9b7bff" className="photo-band-art" />
          )}
          <div className="photo-band-inner" data-reveal-children>
            <span className="eyebrow">New to all this?</span>
            <h2 id="home-cta">Not sure where to begin?</h2>
            <p className="home-hero-lead">
              Start here: what the library holds, how a Lesson works, and which Course fits you.
            </p>
            <Link href={`/learn/${start.slug}`} className="button button-light">
              Start here
            </Link>
            <PhotoCredit photo={cta} />
          </div>
        </section>
      )}
    </>
  );
}
