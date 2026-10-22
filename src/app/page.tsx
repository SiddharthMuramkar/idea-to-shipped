import Image from "next/image";
import Link from "next/link";
import { homePhotos } from "@/app/home-photos";
import { LessonCard } from "@/app/lesson-card";
import { PhotoBand, PhotoCredit } from "@/app/photo-band";
import { Reveal } from "@/app/reveal";
import { lessons } from "@/lessons/lessons";

async function loadLessons() {
  "use cache";
  return lessons.listLessons();
}

// The Lesson grid: three cards to a row, then two, then one on phones.
const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";

// The Main flow, step by step, as the dark band teases it. The Main flow
// Lesson tells the whole story, forks included.
const FLOW_STEPS = [
  {
    skills: ["/grill-with-docs"],
    title: "Grill the idea",
    text: "Claude questions you until the plan is clear, and writes down the words you agree on.",
  },
  {
    skills: ["/to-spec"],
    title: "Write the spec",
    text: "One document says what to build, for whom, and what's out of scope.",
  },
  {
    skills: ["/to-tickets"],
    title: "Cut it into tickets",
    text: "The spec becomes small tickets, each one a single session of work.",
  },
  {
    skills: ["/implement", "/implement-spec"],
    title: "Build and review",
    text: "Drive one ticket at a time, or let it run through all of them.",
  },
  {
    skills: ["/pr"],
    title: "Open the pull request",
    text: "The agent writes the description when the work goes up for review.",
  },
  {
    skills: ["/retro"],
    title: "Look back",
    text: "Go over the session and improve your setup, so the next build starts better.",
  },
];

export default async function Home() {
  const all = await loadLessons();
  const first = all[0];
  const { hero, intro, cta } = homePhotos;

  return (
    <>
      <Reveal />
      {/* The first screen: a full-screen photo under the see-through header. */}
      <PhotoBand className="home-hero" image={hero.image} imageAlt={hero.imageAlt}>
        <span className="eyebrow">A free course in agentic coding</span>
        <h1>From idea to shipped, one Skill at a time.</h1>
        <p className="home-hero-lead">
          A small course on Matt Pocock&apos;s Skills, written as a journal
          while building this very site: what I typed, and what happened.
        </p>
        <div className="button-row">
          <Link href={`/learn/${first.slug}`} className="button button-light">
            Start with Lesson {first.number}
          </Link>
          <Link href="/learn/main-flow" className="button button-outline">
            See the main flow
          </Link>
        </div>
        <PhotoCredit name={hero.imageCredit} />
      </PhotoBand>

      <section id="about" className="band-light">
        <div className="home-section home-intro" data-reveal-children>
          <div data-reveal-children>
            <span className="eyebrow">About the course</span>
            <h2>A journal, not a manual.</h2>
            <p className="section-lead">
              Each Lesson teaches one Skill by showing how I used it to build
              this site, from the first grilling to the shipped pull request.
            </p>
            <p>
              You see the commands I actually typed and what came back, mistakes
              included. Read them in order, or jump to the Skill you need.
            </p>
          </div>
          <figure className="home-intro-figure">
            <span className="home-intro-photo">
              <Image
                src={intro.image}
                alt={intro.imageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 600px"
              />
            </span>
            <figcaption>
              <PhotoCredit name={intro.imageCredit} className="figure-credit" />
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="lessons" className="home-section" data-reveal-children>
        <span className="eyebrow">The course</span>
        <h2>Lessons</h2>
        <p className="section-lead">
          {all.length} Lessons, read in order. Each one ends with what really
          happened.
        </p>
        <ol className="lesson-grid" data-reveal-children>
          {all.map((l) => (
            <li key={l.slug}>
              <LessonCard lesson={l} sizes={CARD_SIZES} />
            </li>
          ))}
        </ol>
      </section>

      <section id="flow" className="band-dark">
        <div className="home-section" data-reveal-children>
          <span className="eyebrow">Which Skill, when</span>
          <h2>The main flow</h2>
          <p className="section-lead">
            Most work takes the same path through the Skills, from idea to
            shipped.
          </p>
          <ol className="flow-steps" data-reveal-children>
            {FLOW_STEPS.map((step, i) => (
              <li key={step.title} className="flow-step">
                <span className="flow-step-number">{i + 1}</span>
                <h3>{step.title}</h3>
                <p className="flow-step-skills">
                  {step.skills.map((c, j) => (
                    <span key={c}>
                      {j > 0 && " or "}
                      <code>{c}</code>
                    </span>
                  ))}
                </p>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="flow-note">
            A question that talking can&apos;t settle? Build a throwaway{" "}
            <code>/prototype</code> first. A small job that fits in one session?
            Go from grilling straight to <code>/implement</code>.
          </p>
          <Link href="/learn/main-flow" className="button button-light">
            See the main flow
          </Link>
        </div>
      </section>

      <section id="start" className="photo-band home-cta">
        <div className="photo-band-photo">
          <Image src={cta.image} alt={cta.imageAlt} fill sizes="100vw" />
        </div>
        <div className="photo-band-inner" data-reveal-children>
          <span className="eyebrow">Your turn</span>
          <h2>Got an idea? Ship it.</h2>
          <p className="home-hero-lead">
            Start at the beginning and follow along, one Skill at a time.
          </p>
          <Link href={`/learn/${first.slug}`} className="button button-light">
            Start with Lesson {first.number}
          </Link>
          <PhotoCredit name={cta.imageCredit} />
        </div>
      </section>
    </>
  );
}
