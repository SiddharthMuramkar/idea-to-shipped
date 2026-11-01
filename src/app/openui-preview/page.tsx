import type { Metadata } from "next";
import Link from "next/link";
import { loadHomeCourse } from "@/app/home-course";
import { PreviewPanel } from "./preview-client";
import { chartLang, customCardsLang, flowLang, lessonsLang, quizLang } from "./samples";

// Unlisted spike page: no nav link anywhere, and noindex if it ever deploys.
export const metadata: Metadata = {
  title: "OpenUI preview · Idea to Shipped",
  robots: { index: false, follow: false },
};

const PANELS = [
  {
    id: "flow",
    heading: "1. The main flow, as tabs",
    blurb:
      "Today this is a static numbered band. Here the same six steps are OpenUI Tabs — click through them, then hit Replay stream to watch the interface assemble line by line, the way a model's output would arrive. Note it opens on the last tab: the stock Tabs keeps selecting whichever tab's content arrived most recently, which suits streaming answers but not static content like this.",
    compare: { href: "/#flow", label: "Compare: the flow band on the home page" },
  },
  {
    id: "lessons",
    heading: "2. Every lesson, as a table",
    blurb:
      "Real titles, Parts, and reading minutes from content/, fed to an OpenUI Table instead of photo cards. Judge density and scannability against the grid, especially on a phone.",
    compare: { href: "/#lessons", label: "Compare: the lesson grid on the home page" },
  },
  {
    id: "quiz",
    heading: "3. A checkpoint, as a form",
    blurb:
      "Lessons use a custom Question block with server re-grading. This is OpenUI's Form + RadioGroup + Chips doing the asking. Submitting only logs an action — there is no assistant behind this preview.",
    compare: { href: "/learn/main-flow", label: "Compare: a lesson with checkpoints" },
  },
  {
    id: "chart",
    heading: "4. Course shape, as charts",
    blurb:
      "Minutes and lesson counts per Part, aggregated from the same data, shown as a bar chart and a donut behind tabs. Nothing on the live site charts anything today.",
    compare: { href: "/#about", label: "Compare: how the home page describes the course" },
  },
  {
    id: "custom",
    heading: "5. Our own card, composed by Lang",
    blurb:
      "The brand-fit test. These cards are this site's component (globals.css classes, real lesson links) registered into an extended OpenUI library. If OpenUI ever earned a place here, it would look like this panel, not panels 1–4.",
    compare: { href: "/#lessons", label: "Compare: the real lesson cards" },
  },
] as const;

export default async function OpenUiPreview() {
  const course = await loadHomeCourse();
  const langById: Record<(typeof PANELS)[number]["id"], string> = {
    flow: flowLang(),
    lessons: lessonsLang(course),
    quiz: quizLang(),
    chart: chartLang(course),
    custom: customCardsLang(course),
  };

  return (
    <div className="openui-preview">
      <span className="eyebrow">Spike — not part of the course</span>
      <h1>Could OpenUI make this site less boring?</h1>
      <p className="section-lead">
        Short version: OpenUI is not a theme or a component kit you reskin
        with. It is a way for an AI model to answer with live interface —
        tabs, tables, charts, forms — composed from components you define,
        streamed as compact OpenUI Lang and rendered in the browser. This
        page previews those components with hand-built Lang and real course
        data. No model, no API key, no cost; whether a model would generate
        Lang this clean is a separate question (Phase 2 in the PR).
      </p>
      <p>
        Judge each panel on: does the interaction beat what the site has
        today, does it survive a phone screen and a keyboard, and — panel 5
        aside — could you stand the default look sitting inside this site?
      </p>

      {PANELS.map((panel) => (
        <section key={panel.id} aria-labelledby={`panel-${panel.id}`}>
          <h2 id={`panel-${panel.id}`}>{panel.heading}</h2>
          <p>{panel.blurb}</p>
          <p className="openui-compare">
            <Link href={panel.compare.href}>{panel.compare.label}</Link>
          </p>
          <PreviewPanel lang={langById[panel.id]} customLibrary={panel.id === "custom"} />
        </section>
      ))}

      <section aria-labelledby="panel-verdict">
        <h2 id="panel-verdict">What would adoption actually mean?</h2>
        <div className="openui-verdict">
          <ul>
            <li>
              A real use needs a model behind it — e.g. an “ask the course”
              assistant whose answers come back as lesson cards and flow
              tabs. Static pages like lessons gain nothing; OpenUI does not
              restyle them.
            </li>
            <li>
              Live generation means a server-side API key, per-request model
              cost, and a generated-content server route — plus a new ADR, since this
              site deliberately chose CSS-only effects and no component
              imports in content.
            </li>
            <li>
              Keeping this site’s look means maintaining a custom component
              library (panel 5), not using the stock styling in panels 1–4.
            </li>
            <li>
              Deleting <code>src/app/openui-preview/</code> and the{" "}
              <code>@openuidev/*</code> dependencies removes every trace of
              this spike.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
