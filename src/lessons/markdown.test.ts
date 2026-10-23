import { describe, expect, test } from "vitest";
import { lex, renderTokens } from "./markdown";

describe("checklists", () => {
  // "- [ ] …" is a list to read, not a form: its squares are drawn, never
  // inputs, so a screen reader doesn't announce unlabeled disabled checkboxes.
  test("draw each box as a hidden square, ticked or not, and no form control", () => {
    const html = renderTokens(lex("- [ ] Each round arrives as numbered questions.\n- [x] You answered in one reply.\n"));
    expect(html).not.toContain("<input");
    expect(html).toContain('<li><span class="task-box" aria-hidden="true"></span>Each round arrives');
    expect(html).toContain('<li><span class="task-box" data-checked aria-hidden="true"></span>You answered');
  });
});
