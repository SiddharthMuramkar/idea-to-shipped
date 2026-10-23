import { describe, expect, test } from "vitest";
import { lessonNumberMentions, partsGoingBackwards, unknownSlashNames } from "./course-lint";
import { PARTS, type Lesson, type LessonSummary } from "./lessons";

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
