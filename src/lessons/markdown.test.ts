import { describe, expect, test } from "vitest";
import { lex, renderInline, renderTokens, type Fail } from "./markdown";

const fail: Fail = (problem) => new Error(problem);

describe("checklists", () => {
  test("draw each box as a hidden square, ticked or not, and no form control", () => {
    const html = renderTokens(lex("- [ ] Each round arrives as numbered questions.\n- [x] You answered in one reply.\n", fail));
    expect(html).not.toContain("<input");
    expect(html).toContain('<li><span class="task-box" aria-hidden="true"></span>Each round arrives');
    expect(html).toContain('<li><span class="task-box" data-checked aria-hidden="true"></span>You answered');
  });
});

describe("raw HTML", () => {
  test("is refused in a block, inline, or nested in a list, through the caller's fail", () => {
    const where: Fail = (problem) => new Error(`x.md: callout: ${problem}`);
    expect(() => lex("<section>\nHi.\n</section>\n", where)).toThrow('x.md: callout: raw HTML isn\'t allowed in a Lesson (found "<section>")');
    expect(() => lex("- one\n- two <u>three</u>\n", where)).toThrow('(found "<u>")');
    expect(() => renderInline("press <kbd>Enter</kbd>", where)).toThrow('(found "<kbd>")');
  });

  test("never reaches marked's own error wrapping", () => {
    expect(() => renderInline("<b>x</b>", fail)).toThrow(
      new Error('raw HTML isn\'t allowed in a Lesson (found "<b>"): write it in Markdown, or put it in backticks to show it as code'),
    );
  });

  test("in backticks, a fenced block or an autolink is not HTML", () => {
    expect(renderInline("`<div>` and <https://example.com>", fail)).toBe(
      '<code>&lt;div&gt;</code> and <a href="https://example.com">https://example.com</a>',
    );
    expect(renderTokens(lex("```html\n<div></div>\n```\n", fail))).toBe(
      '<pre><code class="language-html">&lt;div&gt;&lt;/div&gt;\n</code></pre>\n',
    );
  });
});
