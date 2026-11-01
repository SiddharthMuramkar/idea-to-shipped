import type { Course } from "@/lessons/lessons";

// Hand-built OpenUI Lang for the preview page. No model is involved: these
// strings are generated from real Course data at render time, then handed to
// OpenUI's Renderer. That is enough to judge the built-in components and the
// streaming renderer; it says nothing about how reliably a model would
// generate equivalent Lang (that needs the Gateway phase).
//
// Lang rules that matter here (from the library's generated prompt):
// positional args only, one `identifier = Expression` per line, every
// variable must be referenced, and every program starts at `root = Stack(...)`.

const q = (value: string) => JSON.stringify(value);
const stringArray = (values: string[]) => `[${values.map(q).join(", ")}]`;
const numberArray = (values: number[]) => `[${values.join(", ")}]`;

// Mirrors FLOW_STEPS on the home page (src/app/page.tsx). Preview-only copy;
// if OpenUI were adopted this would need a single shared source.
const FLOW = [
  { value: "grill", trigger: "1 · Grill", skill: "/grill-with-docs", title: "Grill the idea", text: "Claude questions you until the plan is clear, and writes down the words you agree on." },
  { value: "spec", trigger: "2 · Spec", skill: "/to-spec", title: "Write the spec", text: "One document says what to build, for whom, and what's out of scope." },
  { value: "tickets", trigger: "3 · Tickets", skill: "/to-tickets", title: "Cut it into tickets", text: "The spec becomes small tickets, each one a single session of work." },
  { value: "build", trigger: "4 · Build", skill: "/implement", title: "Build and review", text: "Drive one ticket at a time, or let it run through all of them." },
  { value: "pr", trigger: "5 · PR", skill: "/pr", title: "Open the pull request", text: "The agent writes the description when the work goes up for review." },
  { value: "retro", trigger: "6 · Retro", skill: "/retro", title: "Look back", text: "Go over the session and improve your setup, so the next build starts better." },
];

export function flowLang(): string {
  const tabs = FLOW.map((_, i) => `t${i}`).join(", ");
  const lines = [
    `root = Stack([title, tabs])`,
    `title = TextContent(${q("The main flow — one Skill per tab")}, "large-heavy")`,
    `tabs = Tabs([${tabs}])`,
  ];
  FLOW.forEach((step, i) => {
    lines.push(`t${i} = TabItem(${q(step.value)}, ${q(step.trigger)}, c${i})`);
    lines.push(
      `c${i} = [TextContent(${q(`**${step.title}.** ${step.text}`)}), Callout("info", ${q(step.skill)}, ${q("The Skill this step teaches. On the live site this is a static numbered band.")})]`,
    );
  });
  return lines.join("\n");
}

export function lessonsLang(course: Course): string {
  const titles = course.lessons.map((l) => `${l.number}. ${l.title}`);
  const parts = course.lessons.map((l) => (l.part ? `Part ${l.part.number} · ${l.part.title}` : "—"));
  const minutes = course.lessons.map((l) => l.minutes);
  return [
    `root = Stack([title, note, tbl])`,
    `title = TextContent(${q(`${course.lessons.length} lessons, from content/`)}, "large-heavy")`,
    `note = TextContent(${q("Built from the same Course data as the home page grid, rendered here as an OpenUI Table. Sorting and density are the component's, not ours.")})`,
    `tbl = Table([Col("Lesson", titles), Col("Part", parts), Col("Minutes", minutes)])`,
    `titles = ${stringArray(titles)}`,
    `parts = ${stringArray(parts)}`,
    `minutes = ${numberArray(minutes)}`,
  ].join("\n");
}

export function quizLang(): string {
  return [
    `root = Stack([title, form])`,
    `title = TextContent(${q("Checkpoint, as an OpenUI form")}, "large-heavy")`,
    `form = Form("checkpoint", btns, [q1, q2])`,
    `q1 = FormControl(${q("Your idea is still fuzzy. What comes first?")}, RadioGroup("next-step", [r1, r2, r3]), ${q("Lessons ask this as a custom Question block today.")})`,
    `r1 = RadioItem(${q("Grill it")}, ${q("Answer questions until the plan is clear")}, "grill")`,
    `r2 = RadioItem(${q("Write code")}, ${q("Start implementing and see what happens")}, "code")`,
    `r3 = RadioItem(${q("Open a PR")}, ${q("Ship something, then decide")}, "pr")`,
    `q2 = FormControl(${q("Which Skills have you tried?")}, Chips("tried", "multiple", [chip1, chip2, chip3, chip4]))`,
    `chip1 = ChipItem("grill", "/grill-with-docs")`,
    `chip2 = ChipItem("spec", "/to-spec")`,
    `chip3 = ChipItem("tdd", "/tdd")`,
    `chip4 = ChipItem("retro", "/retro")`,
    `btns = Buttons([Button(${q("Check answer")}, @ToAssistant(${q("Check answer")}), "primary")])`,
  ].join("\n");
}

export function chartLang(course: Course): string {
  const groups = new Map<string, { lessons: number; minutes: number }>();
  for (const lesson of course.lessons) {
    const key = lesson.part ? `Part ${lesson.part.number}` : "All lessons";
    const group = groups.get(key) ?? { lessons: 0, minutes: 0 };
    group.lessons += 1;
    group.minutes += lesson.minutes;
    groups.set(key, group);
  }
  const labels = [...groups.keys()];
  const counts = [...groups.values()].map((g) => g.lessons);
  const minutes = [...groups.values()].map((g) => g.minutes);
  return [
    `root = Stack([title, tabs])`,
    `title = TextContent(${q("Course shape — switch the view, same data")}, "large-heavy")`,
    `tabs = Tabs([barTab, pieTab])`,
    `barTab = TabItem("minutes", "Reading minutes", barContent)`,
    `barContent = [BarChart(labels, [minsSeries], "grouped", "Part", "Minutes")]`,
    `pieTab = TabItem("lessons", "Lessons per part", pieContent)`,
    `pieContent = [PieChart(labels, counts, "donut")]`,
    `labels = ${stringArray(labels)}`,
    `minsSeries = Series("Reading minutes", ${numberArray(minutes)})`,
    `counts = ${numberArray(counts)}`,
  ].join("\n");
}

// Rendered with the extended library (see library.tsx), not the stock one:
// SiteLessonCard is this site's own component wearing globals.css classes.
export function customCardsLang(course: Course): string {
  const first = course.lessons.slice(0, 3);
  const refs = first.map((_, i) => `c${i}`).join(", ");
  const lines = [
    `root = Stack([title, row])`,
    `title = TextContent(${q("Our own card, composed by Lang")}, "large-heavy")`,
    `row = Stack([${refs}], "row", "m", "stretch", "start", true)`,
  ];
  first.forEach((lesson, i) => {
    lines.push(
      `c${i} = SiteLessonCard(${q(lesson.title)}, ${q(`Lesson ${lesson.number} · ${lesson.minutes} min read`)}, ${q(`/learn/${lesson.slug}`)})`,
    );
  });
  return lines.join("\n");
}
