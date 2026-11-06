import { describe, expect, test } from "vitest";
import type { Question } from "@/lessons/lessons";
import { firstUnanswered, grade } from "./grade";
import { shuffled, withShuffledOptions } from "./shuffle";

const question = (id: string, correctOption: Question["correctOption"], count = 4): Question => ({
  id,
  kind: "final-test",
  promptHtml: `Question ${id}?`,
  options: (["a", "b", "c", "d", "e", "f"] as const).slice(0, count).map((option) => ({
    id: option,
    html: `Option ${option}`,
    feedbackHtml: "",
  })),
  correctOption,
  explanationHtml: "Because.",
});

describe("shuffling options", () => {
  test("the same seed always gives the same order, and the input is left as it was", () => {
    const items = ["a", "b", "c", "d", "e"];
    expect(shuffled(items, "tdd/quick-1")).toEqual(shuffled(items, "tdd/quick-1"));
    expect(items).toEqual(["a", "b", "c", "d", "e"]);
  });

  test("gives back every item once", () => {
    for (let n = 1; n <= 6; n++) {
      const items = Array.from({ length: n }, (_, i) => i);
      expect([...shuffled(items, `seed-${n}`)].sort()).toEqual(items);
    }
  });

  test("puts the first option anywhere about as often, so its position gives nothing away", () => {
    const seen = [0, 0, 0, 0];
    const runs = 4000;
    for (let i = 0; i < runs; i++) seen[shuffled(["a", "b", "c", "d"], `lesson-${i % 40}/question-${i}`).indexOf("a")]++;
    for (const count of seen) {
      expect(count / runs).toBeGreaterThan(0.2);
      expect(count / runs).toBeLessThan(0.3);
    }
  });

  test("a question keeps its option ids and answer, in an order seeded by the Slug and its id", () => {
    const q = question("which-skill", "a");
    const shown = withShuffledOptions(q, "tdd");
    expect(shown.correctOption).toBe("a");
    expect(shown.options.map((o) => o.id).sort()).toEqual(["a", "b", "c", "d"]);
    expect(withShuffledOptions(q, "tdd").options).toEqual(shown.options);
    const orders = new Set(
      ["tdd", "grilling", "pr", "retro", "triage", "wizard"].map((slug) =>
        withShuffledOptions(q, slug).options.map((o) => o.id).join(""),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});

describe("grading a Final test", () => {
  const questions = [question("one", "b"), question("two", "d"), question("three", "a", 2)];

  test("scores one point per right answer, out of every question", () => {
    const result = grade(questions, { one: "b", two: "a", three: "a" });
    expect(result.score).toBe(2);
    expect(result.total).toBe(3);
    expect([...result.right]).toEqual(["one", "three"]);
  });

  test("a question left unanswered scores nothing", () => {
    expect(grade(questions, { one: "b" }).score).toBe(1);
    expect(grade(questions, {}).score).toBe(0);
  });

  test("finds the first question still without an answer, or -1 when the test can be submitted", () => {
    expect(firstUnanswered(questions, {})).toBe(0);
    expect(firstUnanswered(questions, { one: "c", three: "b" })).toBe(1);
    expect(firstUnanswered(questions, { one: "c", two: "c", three: "b" })).toBe(-1);
  });
});
