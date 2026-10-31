import { describe, expect, test } from "vitest";
import {
  checkAllOrNone,
  checkCheckpoints,
  checkFinalTest,
  checkGoals,
  checkLessonLinks,
  checkLessonNumbers,
  checkLongestOption,
  checkQuestionMix,
  checkScenes,
  checkSiteStory,
  checkSlashNames,
  checkSources,
  checkWordCount,
  lessonNumberMentions,
  unknownSlashNames,
} from "./course-lint";
import type { Block, Lesson, LessonSummary, Question } from "./lessons";

// The real Course follows every rule, so none of them fires on it. These
// tests make each one fire, so a rule that stopped working, or a message that
// stopped saying how to fix it, can't go unnoticed.

function summary(number: number, slug: string): LessonSummary {
  return { number, slug, title: slug, photo: null, part: null, minutes: 1 };
}

// A Lesson holding just these blocks, for checking one rule at a time.
function lessonWith(blocks: Block[], slug = "grilling"): Lesson {
  return { ...summary(0, slug), intro: blocks, sections: [], previous: null, next: null };
}

// A question with these option HTMLs; the one at `correct` is right.
function question(id: string, optionsHtml: string[], correct = 0, kind: Question["kind"] = "final-test"): Question {
  const options = optionsHtml.map((html, i) => ({
    id: (["a", "b", "c", "d"] as const)[i],
    html,
    feedbackHtml: "Because.",
  }));
  return { id, kind, promptHtml: "Which one?", options, correctOption: options[correct].id };
}

const checkpoint = (id: string): Block => ({ type: "checkpoint", question: question(id, ["A.", "B.", "C."], 0, "checkpoint") });
const finalTest = (...ids: string[]): Block => ({ type: "finalTest", questions: ids.map((id) => question(id, ["A.", "B.", "C."])) });

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

describe("checkGoals", () => {
  test("names a missing goals block, a second one, and the wrong number of goals", () => {
    const goals = (count: number): Block => ({ type: "goals", itemsHtml: Array.from({ length: count }, (_, i) => `Goal ${i}.`) });
    expect(checkGoals(lessonWith([]))).toEqual([
      "has no goals block: open the Lesson with a ```goals block listing 3 or 4 goals",
    ]);
    expect(checkGoals(lessonWith([goals(3), goals(3)]))).toEqual(["has 2 goals blocks: keep one, before the first ## heading"]);
    expect(checkGoals(lessonWith([goals(5)]))).toEqual(["its goals block lists 5 goals: list 3 or 4"]);
    expect(checkGoals(lessonWith([goals(4)]))).toEqual([]);
  });
});

describe("checkScenes", () => {
  test("names a Lesson without a Scene", () => {
    expect(checkScenes(lessonWith([{ type: "prose", html: "<p>Text.</p>" }]))).toEqual([
      "has no Scene: picture an idea with a ```scene block (chat, terminal, flow, files or meter) in one of its Sections",
    ]);
  });
});

describe("checkCheckpoints", () => {
  test("names too few or too many Checkpoints", () => {
    const message = (count: number) =>
      `has ${count} Checkpoints: it needs 3 to 5, each a \`\`\`checkpoint <id> block right after the idea it checks`;
    expect(checkCheckpoints(lessonWith([checkpoint("a"), checkpoint("b")]))).toEqual([message(2)]);
    expect(checkCheckpoints(lessonWith(["a", "b", "c", "d", "e", "f"].map(checkpoint)))).toEqual([message(6)]);
    expect(checkCheckpoints(lessonWith(["a", "b", "c"].map(checkpoint)))).toEqual([]);
  });
});

describe("checkFinalTest", () => {
  test("names a missing Final test, with the size this Lesson's needs", () => {
    expect(checkFinalTest(lessonWith([]))).toEqual([
      'has no Final test: end it with a "## Final test" Section of 8 to 10 ```final-test <id> blocks',
    ]);
    expect(checkFinalTest(lessonWith([], "start-here"))).toEqual([
      'has no Final test: end it with a "## Final test" Section of 5 to 6 ```final-test <id> blocks',
    ]);
  });

  test("names a Final test of the wrong size", () => {
    const ids = ["a", "b", "c", "d", "e", "f", "g"];
    expect(checkFinalTest(lessonWith([finalTest(...ids)]))).toEqual(["its Final test has 7 questions: it needs 8 to 10"]);
    expect(checkFinalTest(lessonWith([finalTest(...ids, "h")]))).toEqual([]);
  });
});

describe("checkQuestionMix", () => {
  test('names each kind of question the Final test has too few of, except in "start-here"', () => {
    const blocks = [finalTest("scenario-a", "scenario-b", "spot-a", "why-a")];
    expect(checkQuestionMix(lessonWith(blocks))).toEqual([
      'its Final test has 2 "scenario-" questions (a situation to act in): it needs at least 3, each with an id that starts "scenario-"',
      'its Final test has 1 "spot-" questions (a mistake to spot): it needs at least 2, each with an id that starts "spot-"',
      'its Final test has 0 "sequence-" questions (steps to put in order): it needs at least 1, each with an id that starts "sequence-"',
    ]);
    expect(checkQuestionMix(lessonWith(blocks, "start-here"))).toEqual([]);
  });
});

describe("checkSiteStory", () => {
  test("names a Lesson the site launched with that tells no Site story, and only those", () => {
    expect(checkSiteStory(lessonWith([], "grilling"))).toEqual([
      "has no Site story: add a ```site-story block telling how the author really used it building this site (every Lesson the site launched with tells one)",
    ]);
    expect(checkSiteStory(lessonWith([{ type: "siteStory", html: "<p>Story.</p>" }], "grilling"))).toEqual([]);
    expect(checkSiteStory(lessonWith([], "retro"))).toEqual([]);
  });
});

describe("checkLongestOption", () => {
  const lessonAsking = (...questions: Question[]) => lessonWith([{ type: "finalTest", questions }]);

  test("names each question whose correct option is longer than every other option, with the lengths", () => {
    const lesson = lessonAsking(
      question("spot-long", ["Run it twice.", "Clear the window, then run it again.", "Stop."], 1),
      question("scenario-fine", ["Clear the window first.", "Run it.", "Stop."], 2),
    );
    expect(checkLongestOption(lesson)).toEqual([
      'final-test "spot-long": the correct option (b) has 36 characters and the longest wrong one 13, so picking the longest option gives it away: shorten the correct option or lengthen a wrong one',
    ]);
  });

  test("measures the text a reader sees, so tags and entities don't count", () => {
    const lesson = lessonAsking(question("why-tags", ["<code>/clear</code> it", "Use /compact", "Rest &amp; retry"], 0));
    expect(checkLongestOption(lesson)).toEqual([]);
  });

  test("lets the correct option tie with the longest wrong one", () => {
    expect(checkLongestOption(lessonAsking(question("tie", ["Ask first.", "Run tests.", "Stop."], 0)))).toEqual([]);
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

describe("checkSources", () => {
  const sources = (...items: string[]): Block => ({ type: "sources", html: `<ul>\n${items.map((item) => `<li>${item}</li>`).join("\n")}\n</ul>\n` });
  const link = '<a href="https://example.com">Docs</a>';

  test("names a missing sources block, a second one, too few sources and a source without a link", () => {
    expect(checkSources(lessonWith([]))).toEqual([
      "has no sources block: end it with a ```sources block listing at least 3 sources, each a Markdown link",
    ]);
    expect(checkSources(lessonWith([sources(link, link, link), sources(link, link, link)]))).toEqual([
      "has 2 sources blocks: merge them into one",
    ]);
    expect(checkSources(lessonWith([sources(link, "A talk, Matt Pocock")]))).toEqual([
      "its sources block lists 2 sources: list at least 3",
      'source "A talk, Matt Pocock" has no link: write it as [title](https://…)',
    ]);
    expect(checkSources(lessonWith([sources(link, link, link)]))).toEqual([]);
  });
});

describe("checkWordCount", () => {
  test("names a Lesson with too little running text, and what counts", () => {
    expect(checkWordCount(lessonWith([{ type: "prose", html: "<p>Too short.</p>" }]))).toEqual([
      "has 2 words of running text: it needs 1800 to 3000 (prose, callouts, try and Site story blocks count; headings, code, goals, Scenes, questions and sources don't)",
    ]);
  });
});

describe("lessonNumberMentions", () => {
  test("finds a Lesson number in the Lesson's own text, but not in its neighbours' titles or its photo's alt text", () => {
    const lesson: Lesson = {
      ...summary(3, "spec"),
      photo: { image: "/photos/spec.jpg", imageAlt: "A poster for Lesson 3.", imageCredit: "Ada Lens" },
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

  test("accepts the 1.3.1 Skills and the Built-in commands, bare or as the Skill's full name", () => {
    const html = [
      "/grilling",
      "/to-spec",
      "/clear",
      "/btw",
      "/reload-skills",
      "/reload-plugins",
      "/workflows",
      "/autocompact",
      "/simplify",
      "/security-review",
      "/loop",
      "/schedule",
      "/statusline",
      "/mattpocock-skills:grilling",
      "/mattpocock-skills:to-spec",
    ]
      .map(code)
      .join("\n");
    expect(unknownSlashNames(html)).toEqual([]);
  });

  test("flags stale or made-up names, and full names outside mattpocock-skills or naming a Built-in", () => {
    const html = [
      "/to-prd",
      "/mattpocock-skills:to-prd",
      "/mattpocock-skills:clear",
      "/mattpocock:grilling",
      "/other-plugin:grilling",
    ]
      .map(code)
      .join("\n");
    expect(unknownSlashNames(html)).toEqual([
      "/to-prd",
      "/mattpocock-skills:to-prd",
      "/mattpocock-skills:clear",
      "/mattpocock:grilling",
      "/other-plugin:grilling",
    ]);
  });

  test("ignores paths, which have more than one /", () => {
    expect(unknownSlashNames(code("/learn/grilling") + code("/api/comments"))).toEqual([]);
  });

  test("checkSlashNames says where a new name goes", () => {
    expect(checkSlashNames(lessonWith([{ type: "prose", html: code("/to-prd") }]))).toEqual([
      "names `/to-prd`, which is neither a Skill in mattpocock-skills 1.3.1 nor a Built-in command: use its current name, or add a new one to SKILLS or BUILT_IN_COMMANDS in src/lessons/course-lint.ts",
    ]);
  });
});
