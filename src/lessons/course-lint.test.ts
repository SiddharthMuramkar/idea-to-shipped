import { describe, expect, test } from "vitest";
import {
  allOrNoneOfTheAbove,
  lessonNumberMentions,
  longestRightAnswers,
  partsGoingBackwards,
  unknownSlashNames,
} from "./course-lint";
import { PARTS, type Lesson, type LessonSummary, type Question } from "./lessons";

function summary(number: number, slug: string, part: 1 | 2 | 3 | 4 | null): LessonSummary {
  return {
    number,
    slug,
    title: slug,
    image: `/photos/${slug}.jpg`,
    imageAlt: "A photo.",
    imageCredit: "Ada Lens",
    part: part === null ? null : { number: part, title: PARTS[part] },
    minutes: 1,
  };
}

// A question with these option HTMLs; the one at `answer` is right.
function question(id: string, optionsHtml: string[], answer: number): Question {
  const options = optionsHtml.map((html, i) => ({
    id: (["a", "b", "c", "d"] as const)[i],
    html,
    feedbackHtml: "Because.",
  }));
  return { id, kind: "test", promptHtml: "Which one?", options, answer: options[answer].id };
}

describe("partsGoingBackwards", () => {
  test("names each Lesson whose Part drops, and the Lesson just before it", () => {
    const course = [
      summary(0, "start-here", 1),
      summary(1, "grilling", 2),
      summary(2, "debugging", 3),
      summary(3, "spec", 2),
      summary(4, "level-up", 4),
      summary(5, "late-basics", 1),
    ];
    expect(partsGoingBackwards(course)).toEqual([
      "spec (Part 2) comes after debugging (Part 3)",
      "late-basics (Part 1) comes after level-up (Part 4)",
    ]);
  });

  test("is empty when Parts only stay the same or go up", () => {
    const course = [summary(0, "a", 1), summary(1, "b", 1), summary(2, "c", 2), summary(3, "d", 4)];
    expect(partsGoingBackwards(course)).toEqual([]);
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
});

describe("lessonNumberMentions", () => {
  test("finds a Lesson number in the Lesson's own text, but not in its neighbours' titles or its photo's alt text", () => {
    const lesson: Lesson = {
      ...summary(3, "spec", 2),
      imageAlt: "A poster for Lesson 3.",
      intro: [{ type: "prose", html: "<p>As Lesson 2 showed, grill first.</p>\n" }],
      sections: [
        {
          id: "why",
          title: "Why",
          titleHtml: "Why",
          blocks: [{ type: "callout", tone: "tip", html: "<p>Lesson 10 goes deeper.</p>\n" }],
        },
      ],
      previous: { ...summary(2, "grilling", 2), title: "Lesson 2: Grilling" },
      next: { ...summary(4, "tdd", 2), title: "Lesson 4: TDD" },
    };
    expect(lessonNumberMentions(lesson)).toEqual(["Lesson 2", "Lesson 10"]);
  });
});

describe("longestRightAnswers", () => {
  test("names each question whose right answer is longer than every other option, with the lengths", () => {
    const questions = [
      question("spot-long", ["Run it twice.", "Clear the window, then run it again.", "Stop."], 1),
      question("scenario-fine", ["Clear the window first.", "Run it.", "Stop."], 2),
    ];
    expect(longestRightAnswers(questions)).toEqual([
      "spot-long: the right answer (b) has 36 characters, the longest wrong one 13",
    ]);
  });

  test("measures the text a reader sees, so tags and entities don't count", () => {
    const questions = [
      question("why-tags", ["<code>/clear</code> it", "Use /compact", "Rest &amp; retry"], 0),
    ];
    expect(longestRightAnswers(questions)).toEqual([]);
  });

  test("lets the right answer tie with the longest wrong one", () => {
    expect(longestRightAnswers([question("tie", ["Ask first.", "Run tests.", "Stop."], 0)])).toEqual([]);
  });
});

describe("allOrNoneOfTheAbove", () => {
  test('names each "all of the above" or "none of the above" option, in any case', () => {
    const questions = [
      question("why-all", ["Grill first.", "Write a spec.", "All of the above."], 2),
      question("why-none", ["None of the above", "Clear it.", "Compact it."], 1),
      question("why-fine", ["Grill first.", "Write a spec.", "Clear it."], 0),
    ];
    expect(allOrNoneOfTheAbove(questions)).toEqual(["why-all (c)", "why-none (a)"]);
  });

  test('ignores "above" in other phrases', () => {
    const questions = [question("why-above", ["The step above.", "Both steps.", "Neither."], 0)];
    expect(allOrNoneOfTheAbove(questions)).toEqual([]);
  });
});
