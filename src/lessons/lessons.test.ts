import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { parseBody } from "./blocks";
import { parseCourseFile, parseLessonFile } from "./files";
import { allBlocks, allQuestions, countWords, coursesFrom } from "./lessons";

const fixtures = path.join(__dirname, "__fixtures__");

// A fixture Lesson file's header, read on its own, outside any Course. Its
// errors name it "<name>.md".
async function readFixture(folder: string, name: string) {
  const file = `${name}.md`;
  return parseLessonFile(file, await readFile(path.join(fixtures, folder, file), "utf8"));
}

// A fixture Lesson file parsed whole: its header, then its body.
async function parseFixture(folder: string, name: string) {
  const { body, ...header } = await readFixture(folder, name);
  return { ...header, ...parseBody(`${name}.md`, body) };
}

// The valid fixture: a Course with Parts and a Course without, each listing
// its Lessons in an order their file names don't follow.
const valid = coursesFrom(path.join(fixtures, "valid"));

// Its Lessons as the module should hand them out.
const welcome = {
  number: 0,
  slug: "welcome",
  title: "Welcome",
  photo: { image: "/photos/welcome.jpg", imageAlt: "A lighthouse at dawn.", imageCredit: "Ada Lens" },
  part: { number: 1, title: "Getting started" },
  minutes: 1,
};
const setup = {
  number: 1,
  slug: "setup",
  title: "Setup",
  photo: { image: "/photos/setup.jpg", imageAlt: "Two hikers on a ridge: one points ahead.", imageCredit: "Bo Shutter" },
  part: { number: 1, title: "Getting started" },
  minutes: 1,
};
const deploy = { number: 2, slug: "deploy", title: "Deploy", photo: null, part: { number: 2, title: "Shipping" }, minutes: 1 };
const aside = {
  number: 0,
  slug: "aside",
  title: "An aside",
  photo: { image: "/photos/aside.jpg", imageAlt: "A rocket on the launch pad.", imageCredit: "Cy Aperture" },
  part: null,
  minutes: 1,
};
const recap = { number: 1, slug: "recap", title: "Recap", photo: null, part: null, minutes: 1 };

describe("Courses", () => {
  test("each folder is a Course, in folder-name order, its Lessons in course.md's order rather than by file name", async () => {
    expect(await valid.listCourses()).toEqual([
      {
        slug: "with-parts",
        title: "With parts",
        parts: [
          { number: 1, title: "Getting started" },
          { number: 2, title: "Shipping" },
        ],
        lessons: [welcome, setup, deploy],
      },
      { slug: "without-parts", title: "Without parts", parts: null, lessons: [aside, recap] },
    ]);
  });

  test("a Lesson's number is its place in its Course, from 0, and its Part is the heading it's listed under", async () => {
    const course = await valid.getCourse("with-parts");
    expect(course?.lessons.map(({ slug, number, part }) => [slug, number, part?.title])).toEqual([
      ["welcome", 0, "Getting started"],
      ["setup", 1, "Getting started"],
      ["deploy", 2, "Shipping"],
    ]);
  });

  test("a course.md without ## headings is a Course without Parts, so its Lessons have none either", async () => {
    const course = await valid.getCourse("without-parts");
    expect(course?.parts).toBeNull();
    expect(course?.lessons.map((lesson) => lesson.part)).toEqual([null, null]);
  });

  test("getCourse is null for a Course that doesn't exist", async () => {
    expect(await valid.getCourse("nope")).toBeNull();
  });

  test("listLessons returns every Lesson of every Course, a Course at a time", async () => {
    expect(await valid.listLessons()).toEqual([welcome, setup, deploy, aside, recap]);
  });

  test("lessonExists knows the Slugs of every Course", async () => {
    expect(await valid.lessonExists("deploy")).toBe(true);
    expect(await valid.lessonExists("recap")).toBe(true);
    expect(await valid.lessonExists("nope")).toBe(false);
  });

  test("the content is read once and frozen, so no caller can change it for the others", async () => {
    const all = await valid.listCourses();
    expect(await valid.listCourses()).toBe(all);
    expect(() => all[0].lessons.reverse()).toThrow(TypeError);
  });
});

describe("reading time", () => {
  test("is the words a reader sees at 220 a minute, rounded up", async () => {
    // two.md: 440 words, counting its heading and its Checkpoint, but not the
    // fence lines, the [x] boxes or the link's address. three.md: 441 words.
    expect((await readFixture("reading-time", "two")).minutes).toBe(2);
    expect((await readFixture("reading-time", "three")).minutes).toBe(3);
  });
});

describe("photos", () => {
  test("a Lesson without image, imageAlt or imageCredit has no photo", async () => {
    expect((await valid.getLesson("deploy"))?.photo).toBeNull();
  });

  test.each([
    ["missing-image", "no-photo", "missing image): add it, or remove imageAlt and imageCredit"],
    ["missing-image-alt", "no-alt", "missing imageAlt): add it, or remove image and imageCredit"],
    ["missing-image-credit", "no-credit", "missing imageCredit): add it, or remove image and imageAlt"],
    ["photo-image-only", "only-image", "missing imageAlt and imageCredit): add them, or remove image"],
  ])("a Lesson in %s with only some photo keys fails, saying what to add or remove", async (folder, name, fix) => {
    await expect(readFixture(folder, name)).rejects.toThrow(
      `${name}.md: a photo needs image, imageAlt and imageCredit together (${fix} for a Lesson without a photo`,
    );
  });
});

describe("getLesson", () => {
  test("returns the Lesson split into Sections at each ## heading, text rendered as HTML", async () => {
    const lesson = await valid.getLesson("setup");
    expect(lesson?.title).toBe("Setup");
    expect(lesson?.number).toBe(1);
    expect(lesson?.intro).toEqual([]);
    expect(lesson?.sections).toEqual([
      {
        id: "hello",
        title: "Hello",
        titleHtml: "Hello",
        blocks: [{ type: "prose", html: "<p>Some <strong>bold</strong> text.</p>\n" }],
      },
    ]);
  });

  test("text before the first ## heading is the intro", async () => {
    const lesson = await valid.getLesson("welcome");
    expect(lesson?.intro).toEqual([{ type: "prose", html: "<p>Welcome body.</p>\n" }]);
    expect(lesson?.sections).toEqual([]);
  });

  test("Section ids are slugified titles, made unique within the Lesson", async () => {
    const lesson = await parseFixture("sections", "sections");
    expect(lesson.intro).toEqual([{ type: "prose", html: "<p>Before any heading.</p>\n" }]);
    expect(lesson.sections.map(({ id, title, titleHtml }) => ({ id, title, titleHtml }))).toEqual([
      { id: "what-it-is", title: "What it is", titleHtml: "What it is" },
      {
        id: "the-grilling-skill",
        title: "The /grilling Skill",
        titleHtml: "The <code>/grilling</code> <strong>Skill</strong>",
      },
      { id: "what-it-is-2", title: "What it is", titleHtml: "What it is" },
      { id: "what-it-is-3", title: "What it is", titleHtml: "What it is" },
    ]);
  });

  test("smaller headings stay inside their Section's prose", async () => {
    const lesson = await parseFixture("sections", "sections");
    expect(lesson.sections[0].blocks).toEqual([
      {
        type: "prose",
        html: "<p>First section.</p>\n<h3>A smaller heading</h3>\n<p>Still the first section.</p>\n",
      },
    ]);
  });

  test("==key phrase== becomes a <mark>, each pair its own, but == with spaces inside, or ===, stays as typed", async () => {
    const lesson = await parseFixture("mark", "mark");
    expect(lesson.intro).toEqual([
      {
        type: "prose",
        html: [
          "<p>This is a <mark>key phrase</mark> here.</p>",
          "<p>Maths: a == b and c === d stay as they are.</p>",
          "<p>== spaced == stays too.</p>",
          "<p>Nested: <mark><strong>bold</strong> idea</mark> works.</p>",
          "<p>Code: <code>x ==y== z</code> stays code.</p>",
          "<p>Score <mark>8</mark> of <mark>10</mark>, then <mark>a=b</mark> too.</p>",
          "",
        ].join("\n"),
      },
    ]);
  });

  test("a # heading is an error: the title comes from the header", async () => {
    await expect(parseFixture("h1-heading", "shouty")).rejects.toThrow(
      'shouty.md: "# A second title": use ## for Sections; the title comes from the header',
    );
  });

  test("returns the Lesson's photo, its alt text and its credit", async () => {
    expect((await valid.getLesson("setup"))?.photo).toEqual(setup.photo);
  });

  test("returns null for a slug that doesn't exist", async () => {
    expect(await valid.getLesson("nope")).toBeNull();
  });
});

describe("getLesson neighbours", () => {
  test("a middle Lesson links to the ones before and after it in its Course, photos included", async () => {
    const lesson = await valid.getLesson("setup");
    expect(lesson?.previous).toEqual(welcome);
    expect(lesson?.next).toEqual(deploy);
  });

  test("Previous and Next stay inside a Course: its first Lesson has no previous, its last no next", async () => {
    expect((await valid.getLesson("welcome"))?.previous).toBeNull();
    expect((await valid.getLesson("deploy"))?.next).toBeNull();
    expect((await valid.getLesson("aside"))?.previous).toBeNull();
    expect((await valid.getLesson("aside"))?.next).toEqual(recap);
  });
});

describe("how a Course's files fit together", () => {
  test.each([
    [
      "unlisted-file",
      'unlisted-file/course/forgotten.md: course.md doesn\'t list it: add "- forgotten" to course.md where it belongs in the reading order',
    ],
    [
      "missing-lesson-file",
      "missing-lesson-file/course/course.md: lists \"gone\", but there's no gone.md beside it: add the Lesson, or remove the line",
    ],
    [
      "slug-clash",
      'slug-clash/one/twin.md and slug-clash/two/twin.md: both use the slug "twin", but a Slug names one Lesson across every Course (its /learn/twin address, and what its Comments point at): rename the one that isn\'t published yet, its file and its slug together',
    ],
    [
      "file-not-named-by-slug",
      'file-not-named-by-slug/course/old-name.md: its slug is "new-name", but a Lesson\'s file is named after its Slug: rename the file to new-name.md, or put the slug back if it\'s published (Comments point at it)',
    ],
    [
      "no-course-file",
      "no-course-file/course: has no course.md: every folder in no-course-file/ is a Course, so add a course.md that lists its Lessons",
    ],
    [
      "course-folder-not-slug",
      'course-folder-not-slug/folder/course.md: its slug is "elsewhere", but a Course\'s folder is named after its slug: rename the folder to elsewhere',
    ],
    [
      "lesson-outside-course",
      "lesson-outside-course/stray.md: a Lesson file goes in its Course's folder, beside the course.md that lists it",
    ],
  ])("%s fails to load, saying what to fix", async (folder, message) => {
    await expect(coursesFrom(path.join(fixtures, folder)).listCourses()).rejects.toThrow(message);
  });

  test("every problem is reported at once, one per line, each naming its file", async () => {
    const message = await coursesFrom(path.join(fixtures, "several-problems"))
      .listCourses()
      .then(
        () => "",
        (error: Error) => error.message,
      );
    expect(message.split("\n")).toEqual([
      'several-problems/course/untitled.md: missing title: add a "title: …" line to the header',
      "several-problems/course/course.md: lists \"gone\", but there's no gone.md beside it: add the Lesson, or remove the line",
      'several-problems/course/extra.md: course.md doesn\'t list it: add "- extra" to course.md where it belongs in the reading order',
    ]);
  });
});

describe("course.md", () => {
  test("lists a Course's Lessons in order, under its Parts' ## headings", async () => {
    const raw = await readFile(path.join(fixtures, "valid", "with-parts", "course.md"), "utf8");
    expect(parseCourseFile("course.md", raw)).toEqual({
      slug: "with-parts",
      title: "With parts",
      parts: [
        { title: "Getting started", slugs: ["welcome", "setup"] },
        { title: "Shipping", slugs: ["deploy"] },
      ],
      slugs: ["welcome", "setup", "deploy"],
    });
  });

  test("with no ## headings, it's one list: a Course without Parts", async () => {
    const raw = await readFile(path.join(fixtures, "valid", "without-parts", "course.md"), "utf8");
    expect(parseCourseFile("course.md", raw)).toEqual({
      slug: "without-parts",
      title: "Without parts",
      parts: null,
      slugs: ["aside", "recap"],
    });
  });

  test.each([
    [
      "bullet-before-heading",
      '"- early" comes before the first "## " heading: in a Course with Parts every Lesson sits under one, so move it under a heading (or remove every heading for a Course without Parts)',
    ],
    ["listed-twice", '"- grilling": "grilling" is listed twice: list each Lesson once'],
    ["empty-part", 'Part "Coming soon" lists no Lessons: add "- <slug>" lines under it, or remove its heading'],
    ["no-lessons", 'lists no Lessons: add one "- <slug>" line per Lesson, in reading order'],
    ["stray-line", '"The Lessons, in order:": course.md holds only "## <Part title>" lines and "- <slug>" lines'],
    [
      "title-not-slug",
      '"- Grilling an idea": list each Lesson by its Slug, the name of its file without ".md" (as in "- spec-and-issues")',
    ],
    [
      "bad-course-slug",
      'slug "Idea_To_Shipped" isn\'t kebab-case: use a-z, 0-9 and single dashes, and name the Course\'s folder after it',
    ],
  ])("a broken course.md (%s) fails, saying what to fix", async (name, problem) => {
    const raw = await readFile(path.join(fixtures, "course-files", `${name}.md`), "utf8");
    expect(() => parseCourseFile(`${name}.md`, raw)).toThrow(`${name}.md: ${problem}`);
  });
});

describe("Checkpoints and the Final test", () => {
  const checkpoint = {
    id: "who-owns-details",
    kind: "checkpoint",
    promptHtml: "The agent asks which CSS file layout you want. You <strong>don&#39;t care</strong>. Best reply?",
    options: [
      {
        id: "a",
        html: "Research it yourself first.",
        feedbackHtml: "That spends your attention on a detail.",
      },
      {
        id: "b",
        html: "&quot;You decide, using best practice.&quot;",
        feedbackHtml: "Right. You own the <strong>scope</strong>; the agent owns the details.",
      },
      {
        id: "c",
        html: "Skip grilling and start <code>coding</code>.",
        feedbackHtml: "Skipping a decision doesn&#39;t remove it.",
      },
    ],
    correctOption: "b",
  };
  const frontier = {
    id: "scenario-frontier",
    kind: "final-test",
    promptHtml: "What is the frontier?",
    options: [
      { id: "a", html: "The questions it can ask now.", feedbackHtml: "Yes: settled answers push it outward." },
      {
        id: "b",
        html: "Every question it will ever ask.",
        feedbackHtml: "Later questions depend on answers you haven&#39;t given.",
      },
      { id: "c", html: "The last question.", feedbackHtml: "There&#39;s no fixed last question." },
      { id: "d", html: "The first question.", feedbackHtml: "The first round is only the start." },
    ],
    correctOption: "a",
  };
  const spot = {
    id: "spot-the-mistake",
    kind: "final-test",
    promptHtml: "Which line is wrong?",
    options: [
      { id: "a", html: "Line A", feedbackHtml: "Fine." },
      { id: "b", html: "Line B", feedbackHtml: "Fine too." },
      { id: "c", html: "Line C", feedbackHtml: "This one." },
    ],
    correctOption: "c",
  };

  test("a checkpoint block becomes one question, with feedback on every option", async () => {
    const lesson = await parseFixture("questions", "questions");
    expect(lesson.sections[0].blocks).toEqual([
      { type: "prose", html: "<p>Most bad output starts with an unmade decision.</p>\n" },
      { type: "checkpoint", question: checkpoint },
      { type: "prose", html: "<p>More prose.</p>\n" },
    ]);
  });

  test("final-test blocks that sit together form one Final test", async () => {
    const lesson = await parseFixture("questions", "questions");
    expect(lesson.sections[1].blocks).toEqual([{ type: "finalTest", questions: [frontier, spot] }]);
  });

  test("allQuestions lists every question in the order the Lesson asks them", async () => {
    expect(allQuestions(await parseFixture("questions", "questions"))).toEqual([checkpoint, frontier, spot]);
  });

  test("getQuestions is null for a Lesson that doesn't exist", async () => {
    expect(await valid.getQuestions("nope")).toBeNull();
  });

  test.each([
    ["no-answer", "none", 'none.md: checkpoint "pick-one": needs exactly one [x] option'],
    ["two-answers", "two", 'two.md: checkpoint "pick-one": needs exactly one [x] option'],
    [
      "missing-feedback",
      "quiet",
      'quiet.md: final-test "scenario-quiet": option b needs feedback: a "> " line under it',
    ],
    ["two-options", "short", 'short.md: checkpoint "too-few": needs 3 or 4 options (found 2)'],
    ["five-options", "long", 'long.md: checkpoint "too-many": needs 3 or 4 options (found 5)'],
    ["empty-prompt", "blank", 'blank.md: checkpoint "no-prompt": needs a prompt before the options'],
    [
      "bad-question-id",
      "shouty-id",
      'shouty-id.md: checkpoint "Who_Owns": the id must be kebab-case (a-z, 0-9, single dashes), at most 40 characters',
    ],
    [
      "duplicate-question-id",
      "twice",
      'twice.md: final-test "same-id": another question in this Lesson already uses this id: give each question its own',
    ],
    [
      "split-final-test",
      "split",
      'split.md: final-test "second": final-test blocks must sit together (only blank lines between them) to form one Final test',
    ],
    [
      "split-final-test-by-heading",
      "split",
      'split.md: final-test "second": final-test blocks must sit together (only blank lines between them) to form one Final test',
    ],
    [
      "extra-argument",
      "extra",
      'extra.md: checkpoint "my-id": unexpected "extra": write the fence\'s first line as "checkpoint <id>"',
    ],
    [
      "test-in-intro",
      "early-test",
      'early-test.md: final-test "scenario-a": the Final test goes in a Section (after a ## heading), not in the intro',
    ],
    [
      "indented-option",
      "indented",
      'indented.md: checkpoint "pick-one": "  - [x] A": options must start at the beginning of the line ("- [ ]" / "- [x]")',
    ],
    ...(
      [
        ["list-in-prompt", "ordering", 'final-test "sequence-steps": "1. Grill"'],
        ["bullet-in-prompt", "bullets", 'checkpoint "pick-one": "* the database"'],
        ["quote-in-prompt", "quoted", 'checkpoint "pick-one": "> Q1 Who is it for?"'],
        ["fence-in-prompt", "fenced", 'checkpoint "pick-one": "```sh"'],
      ] as const
    ).map(([folder, name, where]) => [
      folder,
      name,
      `${name}.md: ${where}: prompts are one paragraph of inline text; put orderings inside the options`,
    ]),
  ])("a broken question in %s fails, naming the file, the block and its id", async (folder, name, message) => {
    await expect(parseFixture(folder, name)).rejects.toThrow(message);
  });

  test("an uppercase [X] marks the correct option too", async () => {
    const questions = allQuestions(await parseFixture("uppercase-answer", "shout"));
    expect(questions.map(({ id, correctOption }) => ({ id, correctOption }))).toEqual([
      { id: "pick-one", correctOption: "b" },
    ]);
  });
});

describe("block kinds", () => {
  test.each([
    ["kind-typo", "typo", 'typo.md: "checkpiont" is not a block kind: did you mean "checkpoint"?'],
    ["scene-typo", "scnee", 'scnee.md: "scnee" is not a block kind: did you mean "scene"?'],
    [
      "near-miss-in-list",
      "typo-listed",
      'typo-listed.md: "checkpiont" is not a block kind: did you mean "checkpoint"?',
    ],
  ])("a misspelt kind in %s is an error that suggests the right one", async (folder, name, message) => {
    await expect(parseFixture(folder, name)).rejects.toThrow(message);
  });

  test.each([
    ["tip", "callout tip"],
    ["watch-out", "callout watch-out"],
    ["big-idea", "callout big-idea"],
    ["chat", "scene chat"],
    ["terminal", "scene terminal"],
    ["flow", "scene flow"],
    ["files", "scene files"],
    ["meter", "scene meter"],
    ["story", "site-story"],
    ["quiz", "checkpoint <id>"],
    ["question", "checkpoint <id>"],
    ["test", "final-test <id>"],
  ])('a fence opened with just "%s" is an error that names the block it belongs to', async (word, suggestion) => {
    await expect(parseFixture("kind-hints", `hint-${word}`)).rejects.toThrow(
      `hint-${word}.md: "${word}" is not a block kind: did you mean "${suggestion}"?`,
    );
  });

  test.each([
    ["typed-in-list", "listed", "checkpoint", "a list"],
    ["typed-in-blockquote", "boxed", "callout", "a blockquote"],
    ["typed-in-try", "nested-try", "checkpoint", "a try block"],
    ["typed-in-callout", "nested-callout", "scene", "a callout block"],
  ])("a typed block nested in %s is an error: typed blocks sit at the top level", async (folder, name, kind, where) => {
    await expect(parseFixture(folder, name)).rejects.toThrow(
      `${name}.md: typed blocks must sit at the top level (found \`${kind}\` inside ${where})`,
    );
  });

  test.each([
    ["late-goals", "late", "late.md: goals: goals go before the first ## heading"],
    ["goals-not-a-list", "prose-goals", "prose-goals.md: goals: write the goals as a Markdown list"],
    [
      "nested-goals",
      "nested",
      "nested.md: goals: goals items can't contain nested lists: write each goal as one line",
    ],
    ["bad-callout-tone", "loud", 'loud.md: callout: the tone must be tip, watch-out or big-idea (got "shout")'],
  ])("a misused block in %s is an error", async (folder, name, message) => {
    await expect(parseFixture(folder, name)).rejects.toThrow(message);
  });

  test("code fences in real languages stay code, in any case, even when they look like a kind", async () => {
    const lesson = await parseFixture("code-languages", "code");
    expect(lesson.intro).toEqual([
      {
        type: "prose",
        html: [
          '<pre><code class="language-text">plain text, one letter from &quot;test&quot;',
          "</code></pre>",
          '<pre><code class="language-ts">const x: number = 1;',
          "</code></pre>",
          '<pre><code class="language-txt">two letters from &quot;try&quot;',
          "</code></pre>",
          "<pre><code>no language at all",
          "</code></pre>",
          '<pre><code class="language-TS">upper case still counts',
          "</code></pre>",
          '<pre><code class="language-tree">src/',
          "</code></pre>",
          '<pre><code class="language-rs">fn main() {}',
          "</code></pre>",
          '<pre><code class="language-output">what a command printed',
          "</code></pre>",
          "",
        ].join("\n"),
      },
    ]);
  });
});

describe("raw HTML", () => {
  test.each([
    ["html-block", "", '<div class="note">'],
    ["inline-tag", "", "<kbd>"],
    ["comment", "", "<!-- a note to self -->"],
    ["in-heading", "", "<em>"],
    ["in-goals", "goals: ", "<b>"],
    ["in-callout", "callout: ", '<span style="color:red">'],
    ["in-try", "try: ", "<br>"],
    ["in-site-story", "site-story: ", "<img src=x onerror=alert(1)>"],
    ["in-sources", "sources: ", '<a href="https://example.com">'],
    ["in-prompt", 'checkpoint "pick-one": ', "<script>"],
    ["in-option", 'checkpoint "pick-one": ', "<b>"],
    ["in-feedback", 'final-test "scenario-pick": ', "<i>"],
    ["in-caption", "scene chat: ", "<mark>"],
    ["in-chat-line", "scene chat: ", "<b>"],
  ])("raw HTML in %s is an error, naming the file, the block and the HTML", async (name, block, html) => {
    await expect(parseFixture("raw-html", name)).rejects.toThrow(
      `${name}.md: ${block}raw HTML isn't allowed in a Lesson (found "${html}"): write it in Markdown, or put it in backticks to show it as code`,
    );
  });

  test("a tag in backticks or in a code block is code, shown as written", async () => {
    const lesson = await parseFixture("html-in-code", "code");
    expect(lesson.intro).toEqual([
      {
        type: "prose",
        html: [
          "<p>Wrap a tag in backticks, like <code>&lt;div&gt;</code>, to show it as code.</p>",
          '<pre><code class="language-html">&lt;div class=&quot;note&quot;&gt;Careful.&lt;/div&gt;',
          "</code></pre>",
          "",
        ].join("\n"),
      },
    ]);
  });
});

describe("a Lesson using every block kind and every Scene kind", () => {
  const full = coursesFrom(path.join(fixtures, "full"));

  const chat = {
    kind: "chat",
    title: "One grilling round",
    steps: [
      {
        captionHtml: "You start with a <strong>messy</strong> idea.",
        items: [{ from: "you", html: "/grilling a small course site" }],
      },
      {
        captionHtml: "The agent asks the whole frontier.",
        items: [
          { from: "agent", html: "Q1 Who is it for? Just <em>you</em>." },
          { from: "agent", html: "Q2 Where do comments live?" },
        ],
      },
      { captionHtml: "&quot;Yes&quot; accepts its recommendation.", items: [{ from: "you", html: "yes, yes" }] },
    ],
  };
  const terminal = {
    kind: "terminal",
    title: null,
    steps: [
      {
        captionHtml: "Run the tests.",
        items: [
          { type: "command", text: "npm test" },
          { type: "output", text: "FAIL  src/lessons/lessons.test.ts" },
          { type: "output", text: "  1 failed" },
        ],
      },
      {
        captionHtml: "Fix it and run them again.",
        items: [
          { type: "command", text: "npm test" },
          { type: "output", text: "PASS" },
        ],
      },
    ],
  };
  const flow = {
    kind: "flow",
    title: "The main flow",
    nodes: [
      { id: "grill", label: "Grill the idea", side: false },
      { id: "spec", label: "Spec + tickets", side: true },
      { id: "build", label: "Implement", side: false },
    ],
    steps: [
      { captionHtml: "Start by grilling.", items: [{ at: "grill" }] },
      { captionHtml: "Split it if it&#39;s big.", items: [{ at: "spec" }] },
      { captionHtml: "Then build.", items: [{ at: "build" }] },
    ],
  };
  const files = {
    kind: "files",
    title: null,
    steps: [
      {
        captionHtml: "The parser lands.",
        items: [
          { path: "src/lessons/blocks.ts", change: "added" },
          { path: "src/lessons/lessons.ts", change: "changed" },
        ],
      },
      { captionHtml: "Tests follow.", items: [{ path: "src/lessons/course.test.ts", change: "added" }] },
    ],
  };
  const meter = {
    kind: "meter",
    title: "Context window",
    zone: 40,
    steps: [
      { captionHtml: "A fresh session.", items: [{ fill: 5, label: "System prompt" }] },
      {
        captionHtml: "After a long grilling.",
        items: [
          { fill: 38, label: "Grilling transcript" },
          { fill: 62, label: "Spec and code" },
        ],
      },
    ],
  };
  const checkpoint = {
    id: "who-owns-details",
    kind: "checkpoint",
    promptHtml: "The agent asks which CSS layout you want. Best reply?",
    options: [
      { id: "a", html: "Research it yourself.", feedbackHtml: "That spends your attention on a detail." },
      { id: "b", html: "&quot;You decide.&quot;", feedbackHtml: "Right: you own the scope." },
      { id: "c", html: "Start coding.", feedbackHtml: "Skipping a decision doesn&#39;t remove it." },
    ],
    correctOption: "b",
  };
  const finalTest = [
    {
      id: "scenario-frontier",
      kind: "final-test",
      promptHtml: "What is the frontier?",
      options: [
        { id: "a", html: "The questions it can ask now.", feedbackHtml: "Yes." },
        {
          id: "b",
          html: "Every question it will ever ask.",
          feedbackHtml: "No: later ones wait on your answers.",
        },
        { id: "c", html: "The last question.", feedbackHtml: "No." },
      ],
      correctOption: "a",
    },
    {
      id: "spot-the-gap",
      kind: "final-test",
      promptHtml: "Which step is missing?",
      options: [
        { id: "a", html: "Grill", feedbackHtml: "It&#39;s there." },
        { id: "b", html: "Build", feedbackHtml: "It&#39;s there." },
        { id: "c", html: "Review", feedbackHtml: "Yes." },
      ],
      correctOption: "c",
    },
  ];

  test("parses to exactly this structure", async () => {
    const lesson = await full.getLesson("full");
    expect(lesson).toEqual({
      number: 0,
      slug: "full",
      title: "Full lesson",
      photo: { image: "/photos/full.jpg", imageAlt: "Every block in one place.", imageCredit: "Ada Lens" },
      part: { number: 1, title: "The main flow" },
      minutes: 2,
      previous: null,
      next: null,
      intro: [
        {
          type: "goals",
          itemsHtml: [
            "Start a session with <code>/grilling</code>.",
            "Read a <mark>round</mark>.",
            "Answer fast.",
          ],
        },
        { type: "prose", html: "<p>Intro text.</p>\n" },
      ],
      sections: [
        {
          id: "chat",
          title: "Chat",
          titleHtml: "Chat",
          blocks: [
            { type: "scene", scene: chat },
            { type: "prose", html: "<p>Most bad output starts with an <mark>unmade decision</mark>.</p>\n" },
            { type: "checkpoint", question: checkpoint },
          ],
        },
        {
          id: "terminal",
          title: "Terminal",
          titleHtml: "Terminal",
          blocks: [
            { type: "scene", scene: terminal },
            { type: "callout", tone: "big-idea", html: "<p>You own the <strong>architecture</strong>.</p>\n" },
            { type: "callout", tone: "tip", html: "<p>A tip.</p>\n" },
            { type: "callout", tone: "watch-out", html: "<p>Careful.</p>\n" },
          ],
        },
        {
          id: "flow",
          title: "Flow",
          titleHtml: "Flow",
          blocks: [
            { type: "scene", scene: flow },
            { type: "try", html: "<p>Run <code>npm test</code> and watch it fail.</p>\n" },
          ],
        },
        {
          id: "files",
          title: "Files",
          titleHtml: "Files",
          blocks: [
            { type: "scene", scene: files },
            {
              // Four backticks around the Site story let it hold a ``` block.
              type: "siteStory",
              html: "<p>My first message:</p>\n<pre><code>/grilling a small site\n</code></pre>\n<p>Round one had 8 questions.</p>\n",
            },
          ],
        },
        {
          id: "meter",
          title: "Meter",
          titleHtml: "Meter",
          blocks: [
            { type: "scene", scene: meter },
            {
              type: "sources",
              html: '<ul>\n<li><a href="https://example.com/v">Video</a>, Matt Pocock</li>\n<li><a href="https://example.com/d">Docs</a></li>\n</ul>\n',
            },
          ],
        },
        {
          id: "final-test",
          title: "Final test",
          titleHtml: "Final test",
          blocks: [{ type: "finalTest", questions: finalTest }],
        },
      ],
    });
  });

  test("countWords counts prose, callout, try and Site story words, but no headings, code, goals, Scenes, questions or sources", async () => {
    const lesson = await full.getLesson("full");
    // Intro text. (2) + Most bad output ... decision. (8) + You own the
    // architecture. (4) + A tip. (2) + Careful. (1) + Run and watch it fail.
    // (5, the `npm test` is code) + My first message: Round one had 8
    // questions. (8, the ``` block is code).
    expect(countWords(lesson!)).toBe(30);
  });

  test("getQuestions returns the Checkpoint, then the Final test", async () => {
    expect(await full.getQuestions("full")).toEqual([checkpoint, ...finalTest]);
  });
});

describe("Scenes", () => {
  test.each([
    [
      "two-scenes",
      "crowded",
      'crowded.md: scene files: one Scene per Section ("Busy section" already has one): move this one to a Section of its own',
    ],
    ["unknown-flow-node", "lost", 'lost.md: scene flow: "at: deploy": no node "deploy" (add "node: deploy | Label")'],
    [
      "unknown-scene-setting",
      "colour",
      "colour.md: scene chat: unknown setting \"colour\": remove it (a chat Scene's settings are title)",
    ],
    [
      "item-before-step",
      "early",
      'early.md: scene chat: "you: hello" comes before the first "# " step: put a "# <caption>" line above it',
    ],
    ["scene-without-steps", "empty", 'empty.md: scene meter: needs at least one "# " step'],
    ["meter-without-fills", "gauge", 'gauge.md: scene meter: needs at least one "fill: <0-100>% | label" line'],
    ["bad-scene-line", "stray", 'stray.md: scene files: "src/x.ts" isn\'t a files line ("+ path" or "~ path")'],
    [
      "unknown-scene-type",
      "video",
      'video.md: scene: the type must be chat, terminal, flow, files or meter (got "video")',
    ],
    [
      "extra-scene-argument",
      "wordy",
      'wordy.md: scene chat: unexpected "bubbles": write the fence\'s first line as "scene <type>"',
    ],
    [
      "scene-in-intro",
      "opening",
      "opening.md: scene chat: Scenes go in a Section (after a ## heading), not in the intro",
    ],
    [
      "side-node-first",
      "sideways",
      'sideways.md: scene flow: "node: small | Small job | side": a side node needs a main node declared before it',
    ],
  ])("a broken Scene in %s fails, naming the file and the Scene", async (folder, name, message) => {
    await expect(parseFixture(folder, name)).rejects.toThrow(message);
  });

  test("a meter's zone may end in %, and its fills may be decimals", async () => {
    const lesson = await parseFixture("meter-values", "gauge");
    expect(lesson.sections[0].blocks).toEqual([
      {
        type: "scene",
        scene: {
          kind: "meter",
          title: null,
          zone: 40,
          steps: [
            { captionHtml: "Halfway and a bit.", items: [{ fill: 62.5, label: "After grilling" }] },
            { captionHtml: "Full.", items: [{ fill: 100, label: "After implementing" }] },
          ],
        },
      },
    ]);
  });

  test('a terminal line written "\\# …" is output that starts with "#", while "# …" still starts a step', async () => {
    const lesson = await parseFixture("terminal-comments", "shell");
    expect(lesson.sections[0].blocks).toEqual([
      {
        type: "scene",
        scene: {
          kind: "terminal",
          title: null,
          steps: [
            {
              captionHtml: "Copy the example env file.",
              items: [
                { type: "command", text: "cat .env.example" },
                { type: "output", text: "# DATABASE_URL is your Neon connection string" },
                { type: "output", text: "DATABASE_URL=postgres://..." },
                { type: "output", text: "#!/bin/sh" },
                { type: "output", text: "#" },
              ],
            },
            {
              captionHtml: "A plain &quot;# &quot; line still starts the next step.",
              items: [{ type: "command", text: "npm test" }],
            },
          ],
        },
      },
    ]);
  });
});

describe("the complete example", () => {
  // A whole Course of one Lesson, written the way a real one is: the template
  // to copy when starting a Course or a Lesson.
  test("parses, with every block kind and every Scene kind", async () => {
    const lesson = await coursesFrom(path.join(fixtures, "complete-example")).getLesson("grilling-an-idea");
    const kinds = new Set(allBlocks(lesson!).map((block) => (block.type === "scene" ? `scene ${block.scene.kind}` : block.type)));
    expect([...kinds].sort()).toEqual([
      "callout",
      "checkpoint",
      "finalTest",
      "goals",
      "prose",
      "scene chat",
      "scene files",
      "scene flow",
      "scene meter",
      "scene terminal",
      "siteStory",
      "sources",
      "try",
    ]);
  });
});

describe("file encoding", () => {
  test("files saved with Windows line endings and a byte-order mark load like any other", async () => {
    // Written at run time, so git's line-ending settings can't quietly undo it.
    const dir = await mkdtemp(path.join(tmpdir(), "lesson-crlf-"));
    try {
      const from = path.join(fixtures, "full", "full-course");
      await mkdir(path.join(dir, "full-course"));
      for (const name of await readdir(from)) {
        const plain = await readFile(path.join(from, name), "utf8");
        await writeFile(path.join(dir, "full-course", name), "﻿" + plain.replaceAll("\n", "\r\n"));
      }
      const windows = coursesFrom(dir);
      const plain = coursesFrom(path.join(fixtures, "full"));
      expect(await windows.listCourses()).toEqual(await plain.listCourses());
      expect(await windows.getLesson("full")).toEqual(await plain.getLesson("full"));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("broken Lesson headers", () => {
  test.each([
    ["missing-title", "oops", 'oops.md: missing title: add a "title: …" line to the header'],
    [
      "unknown-header-key",
      "colour",
      "colour.md: unknown header key \"colour\": remove it (the header's keys are title, slug, image, imageAlt, imageCredit)",
    ],
    ["duplicate-header-key", "retitled", 'retitled.md: header key "title" is set twice: keep one'],
    [
      "bad-slug",
      "bad-slug",
      'bad-slug.md: slug "Grilling_101" isn\'t kebab-case: use a-z, 0-9 and single dashes (as in "spec-and-issues"), and name the file after it',
    ],
  ])("a header problem in %s fails, naming the file and the fix", async (folder, name, message) => {
    await expect(readFixture(folder, name)).rejects.toThrow(message);
  });
});
