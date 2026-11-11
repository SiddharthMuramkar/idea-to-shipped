import { describe, expect, test } from "vitest";
import { resultStands } from "./grade";
import { radioToFocus } from "./question";

describe("a Final test result standing", () => {
  const result = { doneAt: "2026-11-01T10:00:00.000Z" };

  test("stands while the store holds the Done it saved", () => {
    expect(resultStands(result, { doneAt: "2026-11-01T10:00:00.000Z" })).toBe(true);
  });

  test("falls once the store no longer holds that Done (a reset)", () => {
    expect(resultStands(result, null)).toBe(false);
  });

  test("falls when another tab saved a newer Done", () => {
    expect(resultStands(result, { doneAt: "2026-11-02T10:00:00.000Z" })).toBe(false);
  });
});

describe("the radio to focus in a question", () => {
  // A stand-in for a fieldset: querySelector gives the first element matching
  // the selector, like the DOM does, from radios in order.
  const fieldset = (radios: { name: string; checked: boolean }[]) => ({
    querySelector(selector: string) {
      const wanted = selector.split(",").map((part) => part.trim());
      return (
        radios.find((radio) => wanted.includes("input") || (wanted.includes("input:checked") && radio.checked)) ??
        null
      );
    },
  });

  test("is the checked radio when one is picked", () => {
    const radios = [
      { name: "b", checked: false },
      { name: "a", checked: false },
      { name: "c", checked: true },
    ];
    expect(radioToFocus(fieldset(radios))).toBe(radios[2]);
  });

  test("is the first radio when none is picked", () => {
    const radios = [
      { name: "b", checked: false },
      { name: "a", checked: false },
    ];
    expect(radioToFocus(fieldset(radios))).toBe(radios[0]);
  });
});
