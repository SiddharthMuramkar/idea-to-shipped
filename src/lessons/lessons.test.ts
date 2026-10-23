import path from "node:path";
import { describe, expect, test } from "vitest";
import { countWords, lessonsFrom } from "./lessons";

const fixtures = path.join(__dirname, "__fixtures__");
const lessons = lessonsFrom(path.join(fixtures, "valid"));

// The fixture Lessons as the module should hand them out.
const first = {
  number: 1,
  slug: "first",
  title: "First lesson",
  image: "/photos/first.jpg",
  imageAlt: "A lighthouse at dawn.",
  imageCredit: "Ada Lens",
  part: null,
  minutes: 1,
};
const second = {
  number: 2,
  slug: "second",
  title: "Second lesson",
  image: "/photos/second.jpg",
  imageAlt: "Two hikers on a ridge: one points ahead.",
  imageCredit: "Bo Shutter",
  part: { number: 2, title: "The main flow" },
  minutes: 1,
};
const tenth = {
  number: 10,
  slug: "tenth",
  title: "Tenth lesson",
  image: "/photos/tenth.jpg",
  imageAlt: "A rocket on the launch pad.",
  imageCredit: "Cy Aperture",
  part: null,
  minutes: 1,
};

describe("listLessons", () => {
  test("returns every Lesson ordered by its number, not by file name", async () => {
    expect(await lessons.listLessons()).toEqual([first, second, tenth]);
  });

  test("reading time is the words a reader sees at 220 a minute, rounded up", async () => {
    // two.md: 440 words, counting its heading and its Checkpoint, but not the
    // fence lines, the [x] boxes or the link's address. three.md: 441 words.
    const timed = await lessonsFrom(path.join(fixtures, "reading-time")).listLessons();
    expect(timed.map(({ slug, minutes }) => ({ slug, minutes }))).toEqual([
      { slug: "two-minutes", minutes: 2 },
      { slug: "three-minutes", minutes: 3 },
    ]);
  });

  test("a Lesson's Part comes from its header and is null when the header has none", async () => {
    const [one, two] = await lessons.listLessons();
    expect(one.part).toBeNull();
    expect(two.part).toEqual({ number: 2, title: "The main flow" });
  });
});

describe("getLesson", () => {
  test("returns the Lesson split into Sections at each ## heading, text rendered as HTML", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.title).toBe("Second lesson");
    expect(lesson?.number).toBe(2);
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
    const lesson = await lessons.getLesson("first");
    expect(lesson?.intro).toEqual([{ type: "prose", html: "<p>First body.</p>\n" }]);
    expect(lesson?.sections).toEqual([]);
  });

  test("Section ids are slugified titles, made unique within the Lesson", async () => {
    const lesson = await lessonsFrom(path.join(fixtures, "sections")).getLesson("sections");
    expect(lesson?.intro).toEqual([{ type: "prose", html: "<p>Before any heading.</p>\n" }]);
    expect(lesson?.sections.map(({ id, title, titleHtml }) => ({ id, title, titleHtml }))).toEqual([
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
    const lesson = await lessonsFrom(path.join(fixtures, "sections")).getLesson("sections");
    expect(lesson?.sections[0].blocks).toEqual([
      {
        type: "prose",
        html: "<p>First section.</p>\n<h3>A smaller heading</h3>\n<p>Still the first section.</p>\n",
      },
    ]);
  });

  test("==key phrase== becomes a <mark>, but == with spaces inside, or ===, stays as typed", async () => {
    const lesson = await lessonsFrom(path.join(fixtures, "mark")).getLesson("mark");
    expect(lesson?.intro).toEqual([
      {
        type: "prose",
        html: [
          "<p>This is a <mark>key phrase</mark> here.</p>",
          "<p>Maths: a == b and c === d stay as they are.</p>",
          "<p>== spaced == stays too.</p>",
          "<p>Nested: <mark><strong>bold</strong> idea</mark> works.</p>",
          "<p>Code: <code>x ==y== z</code> stays code.</p>",
          "",
        ].join("\n"),
      },
    ]);
  });

  test("a # heading is an error: the title comes from the header", async () => {
    const broken = lessonsFrom(path.join(fixtures, "h1-heading"));
    await expect(broken.getLesson("shouty")).rejects.toThrow(
      'shouty.md: "# A second title": use ## for Sections; the title comes from the header',
    );
  });

  test("returns the Lesson's photo, its alt text and its credit", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.image).toBe("/photos/second.jpg");
    expect(lesson?.imageAlt).toBe("Two hikers on a ridge: one points ahead.");
    expect(lesson?.imageCredit).toBe("Bo Shutter");
  });

  test("returns null for a slug that doesn't exist", async () => {
    expect(await lessons.getLesson("nope")).toBeNull();
  });
});

describe("Checkpoints and the Final test", () => {
  const quiz = lessonsFrom(path.join(fixtures, "questions"));

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
    answer: "b",
  };
  const frontier = {
    id: "scenario-frontier",
    kind: "test",
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
    answer: "a",
  };
  const spot = {
    id: "spot-the-mistake",
    kind: "test",
    promptHtml: "Which line is wrong?",
    options: [
      { id: "a", html: "Line A", feedbackHtml: "Fine." },
      { id: "b", html: "Line B", feedbackHtml: "Fine too." },
      { id: "c", html: "Line C", feedbackHtml: "This one." },
    ],
    answer: "c",
  };

  test("a checkpoint block becomes one question, with feedback on every option", async () => {
    const lesson = await quiz.getLesson("questions");
    expect(lesson?.sections[0].blocks).toEqual([
      { type: "prose", html: "<p>Most bad output starts with an unmade decision.</p>\n" },
      { type: "checkpoint", question: checkpoint },
      { type: "prose", html: "<p>More prose.</p>\n" },
    ]);
  });

  test("test blocks that sit together form one Final test", async () => {
    const lesson = await quiz.getLesson("questions");
    expect(lesson?.sections[1].blocks).toEqual([{ type: "finalTest", questions: [frontier, spot] }]);
  });

  test("getQuestions lists every question in the order the Lesson asks them", async () => {
    expect(await quiz.getQuestions("questions")).toEqual([checkpoint, frontier, spot]);
  });

  test("getQuestions is null for a Lesson that doesn't exist", async () => {
    expect(await quiz.getQuestions("nope")).toBeNull();
  });

  test.each([
    ["no-answer", "none", 'none.md: checkpoint "pick-one": needs exactly one [x] option'],
    ["two-answers", "two", 'two.md: checkpoint "pick-one": needs exactly one [x] option'],
    [
      "missing-feedback",
      "quiet",
      'quiet.md: test "scenario-quiet": option b needs feedback: a "> " line under it',
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
      'twice.md: test "same-id": another question in this Lesson already uses this id',
    ],
    [
      "split-final-test",
      "split",
      'split.md: test "second": test blocks must sit together (only blank lines between them) to form one Final test',
    ],
    [
      "split-final-test-by-heading",
      "split",
      'split.md: test "second": test blocks must sit together (only blank lines between them) to form one Final test',
    ],
  ])("a broken question in %s fails, naming the file, the block and its id", async (folder, slug, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.getLesson(slug)).rejects.toThrow(message);
  });
});

describe("block kinds", () => {
  test.each([
    ["kind-typo", "typo", 'typo.md: "checkpiont" is not a block kind. Did you mean "checkpoint"?'],
    ["scene-typo", "scnee", 'scnee.md: "scnee" is not a block kind. Did you mean "scene"?'],
  ])("a misspelt kind in %s is an error that suggests the right one", async (folder, slug, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.getLesson(slug)).rejects.toThrow(message);
  });

  test.each([
    ["late-goals", "late", "late.md: goals: goals go before the first ## heading"],
    ["goals-not-a-list", "prose-goals", "prose-goals.md: goals: write the goals as a Markdown list"],
    ["bad-callout-tone", "loud", 'loud.md: callout: the tone must be tip, watch-out or big-idea (got "shout")'],
  ])("a misused block in %s is an error", async (folder, slug, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.getLesson(slug)).rejects.toThrow(message);
  });

  test("code fences in real languages stay code, even when they look like a kind", async () => {
    const lesson = await lessonsFrom(path.join(fixtures, "code-languages")).getLesson("code");
    expect(lesson?.intro).toEqual([
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
          "",
        ].join("\n"),
      },
    ]);
  });
});

describe("a Lesson using every block kind and every Scene kind", () => {
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
    answer: "b",
  };
  const finalTest = [
    {
      id: "scenario-frontier",
      kind: "test",
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
      answer: "a",
    },
    {
      id: "spot-the-gap",
      kind: "test",
      promptHtml: "Which step is missing?",
      options: [
        { id: "a", html: "Grill", feedbackHtml: "It&#39;s there." },
        { id: "b", html: "Build", feedbackHtml: "It&#39;s there." },
        { id: "c", html: "Review", feedbackHtml: "Yes." },
      ],
      answer: "c",
    },
  ];

  test("parses to exactly this structure", async () => {
    const lesson = await lessonsFrom(path.join(fixtures, "full")).getLesson("full");
    expect(lesson).toEqual({
      number: 1,
      slug: "full",
      title: "Full lesson",
      image: "/photos/full.jpg",
      imageAlt: "Every block in one place.",
      imageCredit: "Ada Lens",
      part: { number: 2, title: "The main flow" },
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
    const lesson = await lessonsFrom(path.join(fixtures, "full")).getLesson("full");
    // Intro text. (2) + Most bad output ... decision. (8) + You own the
    // architecture. (4) + A tip. (2) + Careful. (1) + Run and watch it fail.
    // (5, the `npm test` is code) + My first message: Round one had 8
    // questions. (8, the ``` block is code).
    expect(countWords(lesson!)).toBe(30);
  });

  test("getQuestions returns the Checkpoint, then the Final test", async () => {
    const all = await lessonsFrom(path.join(fixtures, "full")).getQuestions("full");
    expect(all).toEqual([checkpoint, ...finalTest]);
  });
});

describe("Scenes", () => {
  test.each([
    ["two-scenes", "crowded", 'crowded.md: scene files: one Scene per Section ("Busy section" already has one)'],
    ["unknown-flow-node", "lost", 'lost.md: scene flow: "at: deploy": no node "deploy" (add "node: deploy | Label")'],
    ["unknown-scene-setting", "colour", 'colour.md: scene chat: unknown setting "colour"'],
    ["item-before-step", "early", 'early.md: scene chat: "you: hello" comes before the first "# " step'],
    ["scene-without-steps", "empty", 'empty.md: scene meter: needs at least one "# " step'],
    ["bad-scene-line", "stray", 'stray.md: scene files: "src/x.ts" isn\'t a files line ("+ path" or "~ path")'],
    [
      "unknown-scene-type",
      "video",
      'video.md: scene: the type must be chat, terminal, flow, files or meter (got "video")',
    ],
  ])("a broken Scene in %s fails, naming the file and the Scene", async (folder, slug, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.getLesson(slug)).rejects.toThrow(message);
  });
});

describe("getLesson neighbours", () => {
  test("a middle Lesson links to the one before and after it, photos included", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.previous).toEqual(first);
    expect(lesson?.next).toEqual(tenth);
  });

  test("the first Lesson has no previous, the last has no next", async () => {
    expect((await lessons.getLesson("first"))?.previous).toBeNull();
    expect((await lessons.getLesson("tenth"))?.next).toBeNull();
  });
});

describe("lessonExists", () => {
  test("is true for a real slug and false for an unknown one", async () => {
    expect(await lessons.lessonExists("tenth")).toBe(true);
    expect(await lessons.lessonExists("nope")).toBe(false);
  });
});

describe("broken Lesson files", () => {
  test("a Lesson without a title fails loudly, naming the file", async () => {
    const broken = lessonsFrom(path.join(fixtures, "missing-title"));
    await expect(broken.listLessons()).rejects.toThrow("oops.md: missing title");
  });

  test.each([
    ["missing-image", "no-photo.md: missing image"],
    ["missing-image-alt", "no-alt.md: missing imageAlt"],
    ["missing-image-credit", "no-credit.md: missing imageCredit"],
  ])("a Lesson in %s fails loudly, naming the file", async (folder, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.listLessons()).rejects.toThrow(message);
  });

  test.each([
    ["unknown-header-key", 'colour.md: unknown header key "colour"'],
    ["bad-part", 'five.md: part must be 1, 2, 3 or 4 (got "5")'],
    ["bad-order", 'two.md: order must be a whole number (got "two")'],
    ["duplicate-slug", '01-twin.md and 02-twin-again.md: both use slug "twin"'],
    ["duplicate-order", '03-alpha.md and 03-beta.md: both use order 3'],
  ])("a header problem in %s fails the whole listing, naming the files", async (folder, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.listLessons()).rejects.toThrow(message);
  });
});
