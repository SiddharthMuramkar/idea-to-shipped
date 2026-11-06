import { describe, expect, test } from "vitest";
import {
  checkAllOrNone,
  checkFinalTest,
  checkLessonLinks,
  checkLessonNumbers,
  checkPhoto,
  checkSlashNames,
  checkSummary,
  lessonNumberMentions,
  unknownSlashNames,
} from "./course-lint";
import type { Block, Credit, Lesson, LessonSummary, Photo, Question, Section } from "./lessons";

// Every Course follows every rule, so none of them should fire on content/.
// These tests make each one fire, so a rule that stopped working, or a
// message that stopped saying how to fix it, can't go unnoticed.

function summary(number: number, slug: string): LessonSummary {
  return {
    number,
    slug,
    title: slug,
    summary: "A sentence.",
    course: { slug: "course", title: "Course" },
    photo: null,
    part: null,
    minutes: 1,
  };
}

// A Lesson holding just these blocks, for checking one rule at a time.
function lessonWith(blocks: Block[], slug = "grilling"): Lesson {
  return { ...summary(0, slug), intro: blocks, sections: [], previous: null, next: null };
}

// A Lesson made of these Sections, titled by their keys.
function lessonOf(sections: Record<string, Block[]>): Lesson {
  const list: Section[] = Object.entries(sections).map(([title, blocks]) => ({
    id: title.toLowerCase().replaceAll(" ", "-"),
    title,
    titleHtml: title,
    blocks,
  }));
  return { ...lessonWith([]), sections: list };
}

// A question with these option HTMLs; the one at `correct` is right.
function question(id: string, optionsHtml: string[], correct = 0, kind: Question["kind"] = "final-test"): Question {
  const options = optionsHtml.map((html, i) => ({
    id: (["a", "b", "c", "d", "e", "f"] as const)[i],
    html,
    feedbackHtml: "",
  }));
  return { id, kind, promptHtml: "Which one?", options, correctOption: options[correct].id, explanationHtml: "Because." };
}

const checkpoint = (id: string): Block => ({ type: "checkpoint", question: question(id, ["A.", "B.", "C."], 0, "checkpoint") });
const finalTest = (count: number): Block => ({
  type: "finalTest",
  questions: Array.from({ length: count }, (_, i) => question(`q-${i}`, ["A.", "B.", "C."])),
});
const prose: Block = { type: "prose", html: "<p>Text.</p>\n" };
const sources: Block = { type: "sources", html: '<ul>\n<li><a href="https://example.com">Docs</a></li>\n</ul>\n' };

describe("checkLessonLinks", () => {
  test("names each link to a Slug no Lesson has, and lets anchors and real Slugs through", () => {
    const lesson = lessonWith([
      {
        type: "prose",
        html: '<p><a href="/learn/grilling#why">Grilling</a> and <a href="/learn/grill">a typo</a>.</p>',
      },
    ]);
    expect(checkLessonLinks(lesson, new Set(["grilling"]))).toEqual([
      'links to /learn/grill, but no Lesson has the slug "grill": point the link at an existing Lesson\'s Slug',
    ]);
  });
});

describe("checkFinalTest", () => {
  test("passes a Final test of 5 or more questions in a last Section titled Final test, with its sources after it", () => {
    expect(checkFinalTest(lessonOf({ Why: [prose], "Final test": [finalTest(5), sources] }))).toEqual([]);
    expect(checkFinalTest(lessonOf({ "Final test": [prose, finalTest(9)] }))).toEqual([]);
  });

  test("names a Lesson without a Final test", () => {
    expect(checkFinalTest(lessonOf({ Why: [prose] }))).toEqual([
      'has no Final test: end it with a "## Final test" Section of at least 5 ```final-test <id> blocks',
    ]);
  });

  test("names a Final test of fewer than 5 questions", () => {
    expect(checkFinalTest(lessonOf({ "Final test": [finalTest(4)] }))).toEqual([
      "its Final test has 4 questions: it needs at least 5, each a ```final-test <id> block",
    ]);
    expect(checkFinalTest(lessonOf({ "Final test": [finalTest(1)] }))).toEqual([
      "its Final test has 1 question: it needs at least 5, each a ```final-test <id> block",
    ]);
  });

  test("names a Final test that isn't in the last Section, or sits under another title", () => {
    expect(checkFinalTest(lessonOf({ "Check yourself": [finalTest(5)], "Read more": [prose] }))).toEqual([
      'its Final test is in "Check yourself", but it goes in the Lesson\'s last ## Section: move the Final test, and the sources after it, to the end',
      'its Final test sits under "## Check yourself": title that Section "Final test"',
    ]);
  });

  test("names anything but one sources block after the questions", () => {
    expect(checkFinalTest(lessonOf({ "Final test": [finalTest(5), prose, checkpoint("late"), sources, sources] }))).toEqual([
      "has text after its Final test's questions: only a sources block may follow them, so move it above the Final test",
      "has a checkpoint after its Final test's questions: only a sources block may follow them, so move it above the Final test",
      "has two sources blocks after its Final test: merge them into one",
    ]);
  });
});

describe("checkSummary", () => {
  test("names a Lesson without a summary, or with one over 200 characters", () => {
    expect(checkSummary({ summary: null })).toEqual([
      'has no summary: add a "summary: …" line to its header, one plain sentence of at most 200 characters saying what it teaches (cards show it)',
    ]);
    expect(checkSummary({ summary: "x".repeat(201) })).toEqual(["its summary has 201 characters: shorten it to at most 200"]);
    expect(checkSummary({ summary: "x".repeat(200) })).toEqual([]);
  });

  test("counts characters as a reader sees them, so an emoji is one", () => {
    expect(checkSummary({ summary: `${"x".repeat(199)}🚀` })).toEqual([]);
  });
});

describe("checkAllOrNone", () => {
  test('names each "all of the above" or "none of the above" option, in any case', () => {
    const lesson = lessonWith([
      checkpoint("fine"),
      {
        type: "finalTest",
        questions: [
          question("why-all", ["Grill first.", "Write a spec.", "All of the above."], 2),
          question("why-none", ["None of the above", "Clear it.", "Compact it."], 1),
        ],
      },
    ]);
    const fix = "replace it with an answer of its own, since it tests ruling options out rather than understanding";
    expect(checkAllOrNone(lesson)).toEqual([
      `final-test "why-all": option c is "All of the above.": ${fix}`,
      `final-test "why-none": option a is "None of the above": ${fix}`,
    ]);
  });

  test('ignores "above" in other phrases', () => {
    const lesson = lessonWith([{ type: "finalTest", questions: [question("why-above", ["The step above.", "Both steps.", "Neither."])] }]);
    expect(checkAllOrNone(lesson)).toEqual([]);
  });
});

describe("lessonNumberMentions", () => {
  test("finds a Lesson number in the Lesson's own text, but not in its neighbours' titles or its photo's alt text", () => {
    const lesson: Lesson = {
      ...summary(3, "spec"),
      photo: { image: "/images/lessons/spec.jpg", imageAlt: "A poster for Lesson 3.", credit: null },
      intro: [{ type: "prose", html: "<p>As Lesson 2 showed, grill first.</p>\n" }],
      sections: [
        {
          id: "why",
          title: "Why",
          titleHtml: "Why",
          blocks: [{ type: "callout", tone: "tip", html: "<p>Lesson 10 goes deeper.</p>\n" }],
        },
      ],
      previous: { ...summary(2, "grilling"), title: "Lesson 2: Grilling" },
      next: { ...summary(4, "tdd"), title: "Lesson 4: TDD" },
    };
    expect(lessonNumberMentions(lesson)).toEqual(["Lesson 2", "Lesson 10"]);
    expect(checkLessonNumbers(lesson)[0]).toBe(
      'says "Lesson 2": a Lesson\'s number changes whenever Lessons move, so name the Lesson by its title and link to /learn/<slug>',
    );
  });
});

describe("unknownSlashNames", () => {
  const code = (name: string) => `<p>Type <code>${name}</code> now.</p>`;

  test("accepts the Skills the Courses teach and the Built-in commands, bare or as Matt's Skill's full name", () => {
    const html = [
      "/grilling",
      "/to-spec",
      "/orca-cli",
      "/orchestration",
      "/chief-of-staff",
      "/writing-shape",
      "/clear",
      "/btw",
      "/reload-skills",
      "/workflows",
      "/autocompact",
      "/security-review",
      "/verify",
      "/tasks",
      "/bashes",
      "/install-github-app",
      "/mattpocock-skills:grilling",
      "/mattpocock-skills:to-spec",
    ]
      .map(code)
      .join("\n");
    expect(unknownSlashNames(html)).toEqual([]);
  });

  test("flags stale or made-up names, and full names outside mattpocock-skills or naming a Built-in", () => {
    const html = [
      "/to-plan",
      "/mattpocock-skills:to-prd",
      "/mattpocock-skills:clear",
      "/mattpocock:grilling",
      "/other-plugin:grilling",
    ]
      .map(code)
      .join("\n");
    expect(unknownSlashNames(html)).toEqual([
      "/to-plan",
      "/mattpocock-skills:to-prd",
      "/mattpocock-skills:clear",
      "/mattpocock:grilling",
      "/other-plugin:grilling",
    ]);
  });

  test("lets a Lesson mention a retired name or another author's Skill, bare or by the full name listed", () => {
    expect(unknownSlashNames(["/to-prd", "/diagnose", "/tldr", "/code-review:code-review"].map(code).join("\n"))).toEqual([]);
  });

  test("ignores paths: those with more than one /, and folders at the root such as /tmp", () => {
    expect(unknownSlashNames(code("/learn/grilling") + code("/api/comments") + code("/tmp"))).toEqual([]);
  });

  test("checkSlashNames says where a new name goes", () => {
    expect(checkSlashNames(lessonWith([{ type: "prose", html: code("/to-plan") }]))).toEqual([
      "names `/to-plan`, which is neither a Skill the Courses teach nor a Built-in command: use its current name, or add a new one to SKILLS or BUILT_IN_COMMANDS in src/lessons/course-lint.ts",
    ]);
  });
});

describe("checkPhoto", () => {
  const credit: Credit = {
    title: "Traffic lights",
    author: "Jane Doe",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Traffic_lights.jpg",
  };
  const photo = (changes: Partial<Credit> | null): Photo => ({
    image: "/images/lessons/tdd.jpg",
    imageAlt: "A traffic light.",
    credit: changes && { ...credit, ...changes },
  });
  const there = () => true;

  test("passes no image, or a file that's there with an open licence, an author and an https:// source", () => {
    expect(checkPhoto(null, () => false)).toEqual([]);
    expect(checkPhoto(photo({}), there)).toEqual([]);
  });

  test.each(["CC0", "CC0 1.0", "Public domain", "PD-old-70", "PD-US", "CC BY 2.0", "CC BY 4.0", "CC BY-SA 3.0", "CC BY-SA 3.0 de"])(
    "accepts the licence %s",
    (license) => {
      expect(checkPhoto(photo({ license }), there)).toEqual([]);
    },
  );

  test.each(["CC BY-NC 4.0", "CC BY-ND 2.0", "GFDL", "All rights reserved", "Unsplash License", ""])(
    "names the licence %j, which isn't open enough",
    (license) => {
      expect(checkPhoto(photo({ license }), there)).toEqual([
        `its image /images/lessons/tdd.jpg has the license "${license}" in content/image-credits.json: use an image licensed CC0, Public domain (PD…), CC BY or CC BY-SA instead`,
      ]);
    },
  );

  test("names a file that isn't in public/", () => {
    expect(checkPhoto(photo({}), () => false)).toEqual([
      "its image /images/lessons/tdd.jpg isn't in public/: add the file, or fix the header's image: path",
    ]);
  });

  test("names an image without a credit, and says where the credit goes", () => {
    expect(checkPhoto(photo(null), () => false)).toEqual([
      "its image /images/lessons/tdd.jpg isn't in public/: add the file, or fix the header's image: path",
      'its image /images/lessons/tdd.jpg has no credit: add "/images/lessons/tdd.jpg" to content/image-credits.json, with its title, author, license, licenseUrl and source',
    ]);
  });

  test("names a credit without an author or with a source that isn't an https:// address", () => {
    expect(checkPhoto(photo({ author: " ", source: "http://example.com/a.jpg" }), there)).toEqual([
      'its image /images/lessons/tdd.jpg has no author in content/image-credits.json: name who made it, or write "Unknown author" for a public-domain work',
      'its image /images/lessons/tdd.jpg has the source "http://example.com/a.jpg" in content/image-credits.json: link the page it comes from, starting https://',
    ]);
  });
});
